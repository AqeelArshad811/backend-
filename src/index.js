import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
import connectDB from "./db/index.js";

connectDB().then(()=>{app.listen(process.env.PORT || 8000,()=>console.log(`Server is running on port ${PORT}`))}).catch((error)=>console.log("DB connection failed : ",error))









/*


const app = express();
;(async()=>{
    try {
       await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on('error',(error)=>{
        console.log("Error : ",error)
        throw error
    })
    } catch (error) {
       console.error("Error : ",error) ;
       throw error;
    }
})()

*/