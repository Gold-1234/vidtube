import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {deleteVideo, getAllVideos, publishAVideo, togglePublishStatus, getVideoById, updateVideo} from "../controllers/videos.controller.js"
import { v2 as cloudinary } from "cloudinary"


const videoRouter = Router();

videoRouter.route("/upload").post(
	verifyJWT, 
	upload.fields([
		{
			name: "thumbnail",
			maxCount: 1
		},
		{
			name: "video",
			maxCount: 1
		}
	]),
	 publishAVideo)

videoRouter.route('/publish/:id').get(verifyJWT, togglePublishStatus)
videoRouter.route('/delete/:id').get(verifyJWT,deleteVideo)
videoRouter.route('/').get(verifyJWT,getAllVideos)
videoRouter.route('/:id').get(verifyJWT,getVideoById)
videoRouter.route('/update/:id').patch(verifyJWT,updateVideo)

export default videoRouter