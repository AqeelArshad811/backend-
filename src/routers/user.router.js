import express from 'express';
import { loginUser, logoutUser, registerUser , refreshAccessToken} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.midleware.js';
import { verifyJwt } from '../middlewares/auth.midleware.js';

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1

    }
  ]),
  registerUser
)

router.route("/login").post(loginUser)

//secure route
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)



//router.get('/', registerUser)
// .get('/users', getUsers)



export default router;