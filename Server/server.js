import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import bycript from 'bycryptjs';
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';

import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

import admin from 'firebase-admin';
import serviceAccountKey from './blog-firebase-adminsdk.json' with { type: "json" };
import { getAuth } from 'firebase-admin/auth';

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const server = express();
let PORT = 3000;

server.use(express.json());
server.use(cors());

admin.initializeApp ({ 
    credential: admin.credential.cert(serviceAccountKey)
})

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

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

    let username = await generateUsername(email);

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
            picture = picture.replace("s96-c", "s384-c");
            
            
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

                else { 

                    return res.status(403).json({ "error": "Google account exists, try signing in with google "})
                }
    
            // new acc signup
            } else { 

                let username = await generateUsername(email);

                user = new User({ 

                    personal_info: { fullname: name, email, username },
                    google_auth: true

                })

                await user.save().then((u) => {

                    user = u;
                })

                .catch(err => {

                    return res.status(500).json({ "error": err.message })
                })
            }

            return res.status(200).json(formatDatatoSend(user))

        })

        .catch(err => {

            return res.status(500).json({ "error": "Failed google authentication, try again !!"})
        })
    })



    // password hash
    bcrypt.hash(password, 10, async (err, hashed_password) => {

        let username = email.split("@")[0];

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username}
        })

        user.save().then((u) => {

            return res.status(200).json(formatDatatoSend(u))
        })

    
        .catch(err => { 

            // doing email validation because same req is sent twice
            if(err.code ==11000) {
                return res.status(500).json({ "error": "your email already exists !!"})
            }

            return res.status(500).json({ "error": err.message })

        })
    })


})


server.listen(PORT, () => { 
    console.log('listening on port ' + PORT);
})