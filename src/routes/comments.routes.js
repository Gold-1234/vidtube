import { Router, text } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { v2 as cloudinary } from "cloudinary"
import {addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comments.controller.js";


const commmentRouter = Router();


commmentRouter.route('/add/:id').post(verifyJWT, addComment)
commmentRouter.route('/delete/:id').delete(verifyJWT,deleteComment)
commmentRouter.route('/:id').get(getVideoComments)
// tweetRouter.route('/:id').get(verifyJWT,getVideoById)
commmentRouter.route('/update/:id').patch(verifyJWT,updateComment)

export default commmentRouter