import express from 'express';
import bcrypt from 'bcrypt';
import {createServer} from "node:http";
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import user from './models/user.js';
import auth from './routes/auth.js';
dotenv.config();
const app=express();
const server=createServer(app);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        domain:"localhost:8000",
        maxAge:7 * 24 * 60 * 60 * 1000,
    },
};
const allowedOrigins=[
    "https://localhost:5173"
]
app.use(cors({
    origin:(origin,callback)=>{
        console.log("CORS request from:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}))
app.use(session(sessionOptions));
const db_url=process.env.MONGO_URI;
main().then(()=>{
    console.log("Connected-Successfully");
}).catch((error)=>{
    console.log("Not-Connected");
    console.log(error);
})
async function main(){
    await mongoose.connect(db_url);
}

app.post("/signUp",async(req,res)=>{
    const {username,email,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const new_user=new user({username,email,password:hashedPassword});
    await new_user.save();
    res.status(201).json({message:"user created"});
});

app.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    const userExist=await user.findOne({username:username});
    if(!userExist) return res.status(400).json({message:"Invalid Username"});
    const userMatch=await bcrypt.compare(password,userExist.password);
    if(!userMatch) return res.status(400).json({message:"Invalid Password"});
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{
        expiresIn:'1h'
    });
    res.status(200).json({token,message:"Login successful"})
})

app.get("/check-login",auth,(req,res)=>{
    res.status(200).json({
        isLoggedIn: true,
        user: req.user,
        message: "Token is valid"
    });
})

app.get("/ping", (req, res) => {
  res.send("Backend is alive!");
});

server.listen("8000",()=>{
    console.log("server is listening on port 8000");
})