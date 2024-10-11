import mongoose
 from "mongoose";
 import {DB_NAME} from "../constant.js"

 const connectDB=async()=>{
    try {
        console.log(process.env.MONGODB_URI)
       //console.log(`Connecting to MongoDB with URI: ${process.env.MONGODB_URI}/${DB_NAME}`);
       const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected ! \nDB Name : ${DB_NAME} host is ${connection.connection.host}` )
    } catch (error) {
        console.log("Database connection failed : ",error)
        process.exit(1)
    }
} 

export default connectDB