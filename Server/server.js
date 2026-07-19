import express from 'express';
import mongoose from 'mongoose'


const server = express();
let PORT = 3000;


mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})


server.listen(PORT, () => { 
    console.log('listening on port ' + PORT);
})