import { Router, text } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { v2 as cloudinary } from "cloudinary"
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";


const dashboardRouter = Router();


dashboardRouter.route('/stats/:id').get(verifyJWT, getChannelStats)
dashboardRouter.route('/videos/:id').get(verifyJWT,getChannelVideos)


export default dashboardRouter