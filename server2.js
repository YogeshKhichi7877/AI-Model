import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());

import bcrypt from 'bcrypt';
import db from './db.js';
import User from './models/user.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import console from 'console';

dotenv.config();


const Private_key = process.env.Private_key;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
// Middleware function
const logRequest = (req, res, next) => {
  console.log(`${new Date().toLocaleString()} Request made to : ${req.originalUrl}`);
  next();
};

app.use(logRequest);

// const storage = multer.memoryStorage();
//  const uploads = multer({storage});



// signup page 
app.post('/signup'  ,  (req , res)=>{ 
     let {name , age , password , email} = req.body;
     //console.log(name , age , password , email );

    //const photobase64 = req.file ? req.file.buffer.toString('base64'): null;


    bcrypt.genSalt(10 , (err , salt)=>{

        bcrypt.hash(password , salt , async (err , hash)=>{

            const user = await User.create({
                  name ,
                  age : Number(age) ,
                  password : hash ,
                  email ,
             });
             await user.save();
             //jwt.sign(payload, secretOrPrivateKey , [options, callback])
             const token = jwt.sign({name , age , email } , Private_key  );
             res.cookie("token" , token);
             res.send(user);
        })
    } ) 
})

app.post('/login', async (req, res) => {
  try {
    // console.log('Login request:', req.body); // Debug
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(401).json({ error: "invalid username or password" });
    }
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        console.log("bcrypt error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!isMatch) {
        return res.status(401).json({ error: "invalid username or password" });
      }else {
         res.send(user);
         console.log("yeeeaah , you loged in :)");

      }
     
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: err.message });
  }
});


app.get('/logout' , (req ,res)=>{
    res.cookie("token" , "");
    res.status(200).json({message : "you have successfully logout"});
})

app.listen(3000 , ()=>{
    console.log('http://localhost:3000');
});