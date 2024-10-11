import express from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.midleware.js';

const router = express.Router();

router.route("/register").post(
  upload.fields([
    { 
      name: "avatar" ,
      maxCount: 1
    }, 
    {
      name: "coverImage",
      maxCount: 1

    }
  ]), 
  registerUser
)

//router.get('/', registerUser)
// .get('/users', getUsers)



export default router;