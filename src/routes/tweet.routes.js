import { Router, text } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { v2 as cloudinary } from "cloudinary"
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweets.controller.js";


const tweetRouter = Router();


tweetRouter.route('/publish').post(verifyJWT, createTweet)
tweetRouter.route('/delete/:id').delete(verifyJWT,deleteTweet)
tweetRouter.route('/').get(verifyJWT,getUserTweets)
// tweetRouter.route('/:id').get(verifyJWT,getVideoById)
tweetRouter.route('/update/:id').patch(verifyJWT,updateTweet)

export default tweetRouter