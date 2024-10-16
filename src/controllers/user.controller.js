import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
export const registerUser = asyncHandler(async (req, res) => {
   console.log("files snd by user : ", req.files);
   console.log("req.body : ", req.body);
   const { fullName, username, email, password } = req.body;
   console.log(req.body);
   if (!fullName || !username || !email || !password) {
      throw new ApiError(400, "All fields are required");
   }
   // if (
   //    [fullName, email, username, password].some((field) => field?.trim() === "")
   // ) {
   //    throw new ApiError(400, "All fields are required")
   // }
   const existedUser = await User.findOne({
      $or: [{ username }, { email }],
   });
   if (existedUser) {
      throw new ApiError(409, "User already exists");
   }
   if (!req.files) {
      throw new ApiError(400, "Avatar and cover image is required");
   }
   let avatarLocalPath;
   let coverImageLocalPath;
   if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
   ) {
      avatarLocalPath = req.files.avatar[0].path;
   }
   if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
   ) {
      coverImageLocalPath = req.files.coverImage[0].path

   }
   console.log("avatar path : ", avatarLocalPath);
   //     const avatarLocalPath = req.files?.avatar[0]?.path
   //   const coverImageLocalPath = req.files?.coverImage[0]?.path || "";
   console.log("cover path : ", coverImageLocalPath);

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
   }
   const avatarResponse = await uploadOnCloudnary(avatarLocalPath);
   console.log("avatar upload on cloudnary url is : ", avatarResponse.url);
   const coverImageResponse = await uploadOnCloudnary(coverImageLocalPath);
   //console.log("image upload on cloudnary url is  :  ", coverImageResponse.url);
   if (!avatarResponse) {
      throw new ApiError(400, "Avatar is required");
   }
   const newUser = await User.create({
      username: username.toLowerCase(),
      email: email,
      fullName: fullName,
      avatar: avatarResponse.url,
      coverImage: coverImageResponse?.url || "",
      password,
   });
   const user = await User.findById(newUser._id).select(
      "-password -refreshToken "
   );
   if (!newUser) {
      throw new ApiError(500, "Something went wrong , while registering user");
   }
   console.log("created user : ", user);
   return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId)
      console.log(user);
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save({
         validateBeforeSave: false
      })
      console.log(user._id);
      console.log(accessToken)

      return { accessToken, refreshToken }

   } catch (error) {
      console.log("error in genrating token : ",error)
      throw new ApiError(500, "Something went wrong while generating access and refresh token")
   }
}
export const loginUser = asyncHandler(async (req, res) => {
   // req body -> data 
   //  username , password
   // find user
   // check password
   // generate access token
   // generate refresh token
   // send refresh token in cookie 
   // send access token and refresh token

   const { email, username, password } = req.body
   if (!(email || username)) {
      throw new ApiError(400, "username or email  are required")
   }
   const user = await User.findOne({
      $or: [{ username }, { email }]
   })
   if (!user) {
      throw new ApiError(404, "User not found");
   }
   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
      throw new ApiError(401, "Password in-corect ");
   }
   const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   const options = {
      httpOnly: true,
      secure: true
   }
   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(
         200,
         {
            user: loggedInUser,
            refreshToken,
            accessToken
         },
         " User Logged in successfully"))
}
)
export const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(req.user._id, {
      $set: { refreshToken: undefined }
   }, { new: true }
   )
   const options = {
      httpOnly: true,
      secure: true
   }
   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"))

})

export const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingrefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
   if (!incomingrefreshToken) {
      throw new ApiError(401, "Refresh token is required unauthorized request ") 
   }
   try {
      const decodedToken=jwt.verify(    incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET,)
   const user= await User.findById(decodedToken?._id)
   if(!user){
      throw new ApiError(401, "Invalid refresh token ")
   }
   if(incomingrefreshToken!==user?.refreshToken){
   throw new ApiError(401, "refresh token is expired or used ,Invalid refresh token ! ")
   }
   const options={
       httpOnly:true,
       secure:true
   }
    const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
   
   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, {accessToken,refreshToken:newRefreshToken}, "Access token refreshed successfully"))
      
   
   } catch (error) {
      throw new ApiError(401, error?.message||"Invalid refresh token ")
   }


})






//req.files?.avatar?.length && req.files?.coverImage?.length && await Promise.all([await uploadOnCloudnary(req.files.avatar[0].path), await uploadOnCloudnary(req.files.coverImage[0].path)])

// // let avatarLocalPath = null;
// // let coverImageLocalPath = null;
// // if (req.files?.avatar && req.files.avatar.length > 0) {
// //    avatarLocalPath = req.files.avatar[0].path;
// //    console.log("Avatar path:", avatarLocalPath);
// // } else {
// //    console.error("Avatar file is missing");
// // }
// // if (req.files?.coverImage && req.files.coverImage.length > 0) {
// //    coverImageLocalPath = req.files.coverImage[0].path;
// //    console.log("Cover image path:", coverImageLocalPath);
// // } else {
// //    console.error("Cover image file is missing");
// // }
// // // Throw an error if any required file is missing
// // if (!avatarLocalPath) {
// //    throw new ApiError(400, "Avatar and cover image are required");
// // }

