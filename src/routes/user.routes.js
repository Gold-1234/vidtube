import { Router } from "express";
import { registerUser, loginUser, logoutUser, changePassword, getCurrUser, updateUserAvatar, updateUserCoverImage, refreshAccessToken, getUserChannelProfile } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = Router()


// unsecured routes
userRouter.route("/register").post(
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
	registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/refreshToken").post(refreshAccessToken)


// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/updatePassword").post(verifyJWT, changePassword)
userRouter.route("/").get(verifyJWT, getCurrUser)
userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// userRouter.route("/updateAccount").patch(verifyJWT, upadate)


//image handaling route
userRouter.route("/updateAvatar").patch(
	verifyJWT,
	upload.single("avatar"),
	updateUserAvatar)
userRouter.route("/updateCover").patch(
	verifyJWT, 
	upload.single("coverImage"), 
	updateUserCoverImage)

export default userRouter
