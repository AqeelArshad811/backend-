import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
// const app = express();
import {app} from "./app.js"
dotenv.config({
    path: "./.env",
});
import connectDB from "./db/index.js";

connectDB().then(() => {
    app.listen(
        process.env.PORT|| 8000,
        () => console.log(`Server is running on port ${process.env.PORT}`)
    )
})
    .catch((error) => console.log("DB connection failed : ", error))




// // ;(async()=>{
// //     try {
// //        await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// //        app.on('error',(error)=>{
// //         console.log(`Server is running on port ${process.env.PORT}`)
// //         console.log("Error : ",error)
// //         throw error
// //     })
// //     } catch (error) {
// //        console.error("Error : ",error) ;
// //        throw error;
// //     }
// // })()

