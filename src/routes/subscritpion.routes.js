import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { v2 as cloudinary } from "cloudinary"
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";


const subscriptionRouter = Router();


// subscriptionRouter.route('/video/:id').patch(verifyJWT,toggleVideoLike)
subscriptionRouter.route('/subscriptions/:subscriberId').get(verifyJWT, getSubscribedChannels)
subscriptionRouter.route('/subscribers/:channelId').get(verifyJWT,getUserChannelSubscribers)
subscriptionRouter.route('/:channelId').get(verifyJWT,toggleSubscription)

export default subscriptionRouter
