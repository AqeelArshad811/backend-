import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
   let avatarLocalPath ;
   let  coverImageLocalPath ;
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
