import { Router, text } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { v2 as cloudinary } from "cloudinary"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/likes.controller.js";


const likeRouter = Router();


likeRouter.route('/video/:id').patch(verifyJWT,toggleVideoLike)
likeRouter.route('/video/comment/:id').patch(verifyJWT, toggleCommentLike)
likeRouter.route('/tweet/:id').patch(verifyJWT,toggleTweetLike)
likeRouter.route('/').get(verifyJWT,getLikedVideos)

export default likeRouter
