import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json( ));// recieving data from form 
app.use(express.urlencoded({extended:true}));// recieving data from urls
app.use(express.static("public"));
app.use(cookieParser()); // recieving data from cookies 



export {app} ;