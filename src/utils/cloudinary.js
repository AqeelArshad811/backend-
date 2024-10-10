import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudnary = async (localPathFile) => {
    try {
        if (!localPathFile) return null;
        const response = await cloudinary.uploader.upload(localPathFile, resourse_type = "auto", (error, result) => {
            if (error) {
                console.log(error);
                return null;
            }
            if (!result) return null;
            if (result) return result.url;
        })
        console.log(response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localPathFile)
        return null
    }
}

export { uploadOnCloudnary }
