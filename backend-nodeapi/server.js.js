const express = require("express");
const app= express();
const mongoose = require('mongoose');

const morgan = require("morgan");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //lec44

const expressValidator = require('express-validator');
const fs=require('fs'); //lec 70
const cors = require('cors');
//load env variables
const dotenv= require('dotenv');
dotenv.config();

//DB
mongoose.connect( //process.env.MONGO_URI
    process.env.MONGO_URI,
    {useNewUrlParser: true}
    )
.then(()=>console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});


//bring in routes.

const postRoutes= require('./routes/post');
const authRoutes= require('./routes/auth'); //lec-42
const userRoutes= require('./routes/user'); 
//apiDocs lec70 Documenting Api
app.get('/',(req,res)=>{
  fs.readFile('docs/apiDocs.json',(err, data)=>{
    if(err){
      return res.status(400).json({
        error:err
      })
    }
    const docs = JSON.parse(data)
    res.json(docs)
  });
});

// const myOwnMiddleware = (req,res,next)=>{
//     console.log("Middleware applied!");
//     next();
// };

//MIDDLEWARE:
//middleware= something starts and will end while u wants to do something in the middle say, Authintication.
//  ie,the whole point of using morgan middleware.
app.use(morgan("dev")); //mtlb jb bhi process chlega, file load hoegi. coxe we r accesing it by npm run dev ..isiliye dev paas kiya idhar.
// app.use(myOwnMiddleware);

app.use(bodyParser.json());
app.use(cookieParser());
 
app.use(expressValidator());
app.use(cors()); //lec71
app.use("/",postRoutes);
app.use("/",authRoutes);
app.use("/",userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error:"Unauthorized! Kindly signin"});
    }
  });


const port = process.env.PORT || 9090;
// taking port at 9090 instead of 8080 coze database is using 8080 port &
//  it get started automatically as soon as we start our comp. an by giving port as 8080 (here), 
//  it creates conflict of PermissionRequest. therefore giving 9090 here.

app.listen(port,()=>{console.log(`A Node Js Api is listening on port: ${port}`);
});


//:::::::::::USING CONTROLLERS:::::::::::::::::::::::
