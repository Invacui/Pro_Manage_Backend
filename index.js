const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const env = require('dotenv');
const cors = require('cors');

const auth  = require('./routes/Users');
const data = require('./routes/Data');

//EXPRESS INIT
const app = express();

//USE====>
app.use(cors()); //cors 
app.use(body_parser.urlencoded({extended:false}));  //bodyparser
app.use(express.json());

//EXPRESS ROUTER INSTANCES 
app.use('/auth' , auth);
app.use('/data' , data);


//ENV DATA====>
env.config({path:'./Private.env'});
const PORT = process.env.PORT || 3001;
const BASE_URI = process.env.BASE_URI;
const BASE_URL = process.env.BASE_URL;
const MONGO_URI  = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

//===================================================SERVER-STATUS==========================================
app.listen(PORT , BASE_URI, ()=>{
    //DB CONNECTION
    const DB = mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,                           // Specify your database name here
    })
    .then(()=>console.log("Successfull login to Mongo Server!!"))
    .catch(error=>console.log("Failed to login!!",error))

    console.log("Port is =>"+ PORT)
    console.log("Server is Running Fine!")
})