import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudnary = async (localPathFile) => {
    try {
        if (!localPathFile) return null;
        const response = await cloudinary.uploader.upload(localPathFile, { resource_type: "auto" })
        console.log("file is uploaded to cloudinary", response.url)
        if (fs.existsSync(localPathFile)) { fs.unlinkSync(localPathFile)
            return response
         }
         
    } catch (error) {
        if (fs.existsSync(localPathFile)) { fs.unlinkSync(localPathFile) }
        console.log("error in upload on cloudinary", error)
        return null
    }
}

export { uploadOnCloudnary }
