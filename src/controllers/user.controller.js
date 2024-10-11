import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudnary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
export const registerUser=asyncHandler(async(req,res)=>{  
   try {
      const {fullName,username,email,password}=req.body
      console.log(req.body);
      if(!fullName || !username || !email || !password){
         throw new ApiError(400,"All fields are required")
      }

      if(
         [fullName,email,username,password].some((field)=>field?.trim()==="")          
      ){
         throw new ApiError(400,"All fields are required")
      }
      const existedUser =  User.findOne({
         $or:[{username},{email}]
      })
      if(existedUser){
         throw new ApiError(409,"User already exists")
      }

     const avatarLocalPath = req.files?.avatar[0]?.path;

     const coverImageLocalPath = req.files?.coverImage[0]?.path;
     if(!avatarLocalPath || !coverImageLocalPath){
        throw new ApiError(400,"Avatar and cover image are required")
     }

     const avatar=await uploadOnCloudnary(avatarLocalPath)
     const coverImage=await uploadOnCloudnary(coverImageLocalPath)
     if(!avatar || !coverImage){
      throw new ApiError(400,"Avatar and cover image are required")
     }
     const newUser=await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url ||"",
      username:username.toLowerCase(),
      email,
      password,
     })
     const user =await newUser.findById(newUser._id).select(
      "-password -refreshToken "
     )
     if(!user){
        throw new ApiError(500,"Something went wrong , while registering user")
     }
     return res.status(201).json(new ApiResponse(201,user,"User registered successfully"))






      res.status(200).json({
         // username,email,password
         message:'ok',
         success:true,
         data:req.body
      })
   } catch (error) {
    console.log("register user error : ",error)
   }
}
 
)

// export const getUsers=asyncHandler(async(req,res)=>{
//     console.log("user details ")
//     res.status(200).json({message:'ok'})
// })