import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from './schema/User.js';
import Blog from './schema/Blog.js';

import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

const serviceAccountKey = process.env.FIREBASE_SERVICE_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_KEY)
    : JSON.parse(fs.readFileSync(
        './blog-firebase-adminsdk.json', 'utf8'
    ));

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

let maxLimit = 5;

const server = express();
let PORT = 3000;

server.use(express.json());
server.use(cors());

initializeApp ({ 
    credential: cert(serviceAccountKey)
})

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})


// JWT verification server side
const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {

        return res.status(401).json({ "error": "No access token "});
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {

        if (err) {

            return res.status(403).json({ "error": "Access token is invalid" });
        }

        req.user = user.id;
        next();

    })
}



// usr mongo id encryption with jwt
const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)

    return { 
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}


const generateUsername = async (email) => {

    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username}).then((result) => result)

    isUsernameNotUnique ? username += nanoid().substring(0, 5): "";

    return username;
}


// new acc signup req to server
server.post("/signup", (req, res) => {

    let { fullname, email, password } = req.body;

    // data validation to frontend
    if (fullname.length < 3){
        return res.status(403).json({ "error": "your full name should have atleast 3 letters"})
    }

    if(!email.length){
        return res.status(403).json({ "error": "enter your email !"})
    }

    if(!emailRegex.test(email)){
        return res.status(403).json({ "error": "email is invalid !!"})
    }

    if(!passwordRegex.test(password)){
        return res.status(403).json({ "error": "password should be 6-20 characters with lowercase and uppercase and number" })
    }

    // password hash
    bcrypt.hash(password, 10, async (err, hashed_password) => {

        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username}
        })

        user.save().then((u) => {

            return res.status(200).json(formatDatatoSend(u))
        })

    
        .catch(err => { 

            // doing email validation because same req is sent twice
            if(err.code == 11000) {

                let field = Object.keys(err.keyPattern || {})[0] || "";

                if (field.includes("username")) {
                    return res.status(500).json({ "error": "that username is already taken !!"})
                }

                return res.status(500).json({ "error": "your email already exists !!"})
            }

            return res.status(500).json({ "error": err.message })

        })
    })

})


    // usr sign in route 
    server.post("/signin", (req, res) => {

        let { email, password } = req.body;

        User.findOne({ "personal_info.email": email }).then((user) => {

            if(!user) {

                return res.status(403).json({ "error": "Invalid credentials !!"})
            }

            
            bcrypt.compare(password, user.personal_info.password, (err, result) => {

                if (err) {

                    return res.status(403).json({ "error": "error...try again "})
                }

                if (!result) {

                    return res.status(403).json({ "error": "invalid password !!"})
                   } 
                   else { 

                    return res.status(200).json(formatDatatoSend(user))
                   }

            })

        })

        .catch(err => {

            return res.status(500).json({ "error": err.message })
        })
    })


    // google authentication and login / signup path setup with token verification
    server.post ("/google-auth", async (req, res) => {

        let { access_token } = req.body;

        getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {

            let { email, name, picture } = decodedUser;

            // asking google for bigger img
            picture = picture ? picture.replace("s96-c", "s384-c") : "";
            
            
            let user = await User.findOne({ "personal_info.email": email })

            .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
            .then((u) => {

                return u || null
            })

            .catch(err => {

                return res.status(500).json({ "error": err.message })
            })


            if (user) {
                // login
                if (!user.google_auth) {

                    return res.status(403).json ({ "error": "log in with your password to access this account" })
                }

            } else {

                let username = await generateUsername(email);

                user = new User ({
                    personal_info: { fullname: name, email, username },
                    google_auth: true
                })

                try {

                    user = await user.save();
                }

                catch (err) {

                    return res.status(500).json({ "error": err.message })
                }
            }

            return res.status(200).json(formatDatatoSend(user))

        })

        .catch(err => {

            return res.status(500).json({ "error": "Failed google authentication, try again !!"})
        })
    })

    // get route to render blogs without auth 
    server.post('/latest-blogs', (req, res) => {

        let { page } = req.body;
        Blog.find({ draft: false })

        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page -1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {

            return res.status(200).json({ blogs })
        })

        .catch(err => {

            return res.status(500).json({ "error": err.message })
        })
    })

    // all total published blogs
    server.post('/all-latest-blogs-count', (req, res) => {

        Blog.countDocuments({ draft: false })

        .then(count => {

            return res.status(200)
                .json({ totalDocs: count })
        })

        .catch(err => {

            console.log(err.message);

            return res.status(500).json({ "error": err.message})
        })
    })

    // trending blogs route
    server.get('/trending-blogs', (req, res) => {

        Blog.find({ draft: false })

        .populate("author",

            "personal_info.profile_img " +
            "personal_info.username " +
            "personal_info.fullname -_id"
        )

        .sort({ 

            "activity.total_reads": -1,
            "activity.total_likes": -1,
            "publishedAt": -1
        })

        .select("blog_id title publishedAt -_id")
        .limit(5)
        
        .then(blogs => {

              return res.status(200).json({ blogs })
        })

        .catch(err => {

            return res.status(500).json({ "error ": err.message })
        })
    })

    // filter w search 
    server.post('/search-blogs', (req, res) => {

        let { tag, query, page } = req.body;
        let maxLimit = 5;
        let findQuery;

        if (tag) {

            findQuery = { tags: tag, draft: false };
        }
        else if (query) {

            findQuery = { draft: false, title: new RegExp(query, 'i') }
        }


        Blog.find(findQuery) 

        .populate("author", 

            "personal_info.profile_img" +
            "personal_info.username " +
            "personal_info.fullname -_id")

        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner " + "activity tags publishedAt -_id" )

        .skip((page - 1) * maxLimit)
        .limit(maxLimit)

        .then(blogs => {

            return res.status(200).json({ blogs })
        })

        .catch(err => {

            return res.status(500).json({ "error": err.message })

    } )
    })

    //  blogs count
    server.post('/search-blogs-count', (req, res) => {

        let { tag, query } = req.body;
        let findQuery = { tags: tag, draft: false };

        Blog.countDocuments(findQuery).then(count => {

            return res.status(200).json({ totalDocs: count })
        })

        .catch(err => {

            console.log(err.message);

            return res.status(500).json({ "error": err.message })
        })
    })


    // search user 
    server.post('/search-users', (req, res) => {

        let { query } = req.body;

        User.find ({ "personal_info.username": new RegExp(query, 'i')

        })

        .limit(50)
        .select("personal_info.fullname " + "personal_info.username " + "personal_info.profile_img -_id" )

        .then(users => {

            return res.status(200).json({ users })
        })

        .catch(err => {

            return res.status(500).json({ "error": err.message })
        })
    })


    //  URL parameter and query update and readcount
    server.get('/get-blog/:blog_id', (req, res) => {

        let { blog_id } = req.params;

        Blog.findOneAndUpdate({ blog_id }, { $inc : {"activity.total_reads": 1}}, { new: true })
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
        .select("title des content banner activity publishedAt blog_id tags")
        .then(blog => {

            if (!blog) {

                return res.status(404).json({ "error": "No blog found with that id" })
            }

            return res.status(200).json({ blog })
        })
        .catch (err => {

            return res.status(500).json({ "error": err.message })
        })
    })

    // new blog create route (with temp res)
    server.post("/create-blog", verifyJWT, (req, res) => {

        let authorId = req.user;

        let { title, des, banner, tags, content } = req.body;

        // validation for all input components
        if (!title.length) {

            return res.status(403).json({ "error": "You must have a title !!"})
        }

        if (!des.length || des.length > 200) {

            return res.status(403).json({ "error": "Your blog description should be under 200 words !!"})
        }

        if (!banner.length) {

            return res.status(403).json({ "error": "You must have a banner to publish !!"})
        }

        if (!content.blocks.length) {

            return res.status(403).json({ "error": "You should have some content in blog itself !!"})
        }

        if (!tags.length || tags.length > 10) {

            return res.status(403).json({ "error": "You must provide tags, maximum being 10"})
        }

        // tags into lowercase converter
        tags = tags.map(tag => tag.toLowerCase());

        let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();
    
    
        let blog = new Blog ({
            title,
            des,
            banner,
            content,
            tags,
            author: authorId,
            blog_id
        })

        blog.save().then(blog => {

            let incrementVal = 1;

            User.findOneAndUpdate(

                { _id: authorId },
                { $inc : { "account_info.total_posts" : incrementVal }, $push : { "blogs" : blog._id }}
            )

            .then(user => {

                return res.status(200).json({ id: blog.blog_id })
            })

            .catch(err => {

                return res.status(500).json({ "error": "failed to update total posts number" })
            })
        })

        .catch (err => {

            return res.status(500).json({ "error": err.message })
        })
    })




server.listen(PORT, () => { 
    console.log('listening on port ' + PORT);
})

    
export default server;