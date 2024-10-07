import mongoose
 from "mongoose";
 import {DB_NAME} from "../constant.js"

 const connectDB=async()=>{
    try {
       const connection = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Connected ! \nDB Name : ${DB_NAME} host is ${connection.connection.host}` )
    } catch (error) {
        console.log("mongoose connection failed : ",error)
        process.exit(1)
    }
} 

export default connectDB