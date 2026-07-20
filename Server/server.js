import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bycript from 'bycryptjs';
import User from './Schema/User.js';

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const server = express();
let PORT = 3000;

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})


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
    bcrypt.hash(password, 10, (err, hashed_password) => {

        let username = email.split("@")[0];

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username}
        })

        user.save().then((u) => {

            return res.status(200).json({ user: u })
        })

        .catch(err => {
            return res.status(500).json({ "error": err.message })
        })
    })


})


server.listen(PORT, () => { 
    console.log('listening on port ' + PORT);
})