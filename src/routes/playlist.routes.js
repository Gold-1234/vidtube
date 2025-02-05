import { Router, text } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { v2 as cloudinary } from "cloudinary"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";


const playlistRouter = Router();


playlistRouter.route('/create').post(verifyJWT,createPlaylist)
playlistRouter.route('/').get(verifyJWT, getUserPlaylists)
playlistRouter.route('/:playlistId').get(verifyJWT,getPlaylistById)
playlistRouter.route('/add/:playlistId&:videoId').get(verifyJWT,addVideoToPlaylist)
playlistRouter.route('/remove/:playlistId&:videoId').patch(verifyJWT,removeVideoFromPlaylist)
playlistRouter.route('/delete/:playlistId').delete(verifyJWT,deletePlaylist)
playlistRouter.route('/delete/:playlistId').patch(verifyJWT,updatePlaylist)

export default playlistRouter
