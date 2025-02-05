import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {Video} from "../models/videos.models.js"
import {ApiError} from "../utils/APIError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {id} = req.params
    const {page = 1, limit = 10} = req.query
	 const comments = await Comment.aggregate([
			 {
				 $match: {
					 video: new mongoose.Types.ObjectId(id)
				 }
			 }
		   ])
	return res.json(new ApiResponse(200,	{comments},"Comments fetched succesfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
	const videoId = req.params.id
	
	const content = req.body.comment
	if(!content){
		throw new ApiError(404, "Comment not found!!")
	}
	const newComment = await Comment.create({
		owner: req.user.id,
		content,
		video: videoId,
	})
	if(newComment){
	return res.json(new ApiResponse(200, {newComment}, "Commented!"))
	}
	throw new ApiError(400, "error adding comment!")
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
	const {id} = req.params
	if(!req.body.content){
		throw new ApiError(404, "Content req for comment!")
	}
	const comment = await Comment.findById(id)
	comment.content = req.body.content
	comment.save({validateBeforeSave: false})
	const newComment = await Comment.findById(id)
	return res.json(new ApiResponse(200, {newComment}, "Comment updated!"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
	const {id} = req.params

	await Comment.findByIdAndDelete(id)
	
	return res.json(new ApiResponse(200, "Comment deleted!"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }