import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videos.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/APIError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinaryUpload.js"
import { extractPublicId } from 'cloudinary-build-url'
import { v2 as cloudinary } from "cloudinary"
import likeRouter from "../routes/like.routes.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
   try {
	 //TODO: get all videos based on query, sort, pagination
		const user = req.user
		console.log(user);
		const id = user._id
		console.log(id);
		
		const videos = await Video.aggregate([
			{
				$match: {
					owner: new mongoose.Types.ObjectId(id)
				}
			}
		  ])
		
		return res.status(200).json(new ApiResponse(200, {videos}, "fetched"))
   } catch (error) {
		console.log(error);
   }
})

const publishAVideo = asyncHandler(async (req, res) => {
	console.log('running publishAVideo');
	
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
	console.log(req.body);
	
	const videoPath = req.files?.video?.[0].path
	console.log(videoPath);
	
	const thumbnailPath = req.files?.thumbnail?.[0].path
	console.log(thumbnailPath);

	if(!videoPath){
		throw new ApiError(400, 'Video is required to upload!')
	}
	
	let videoFile
	try {
		videoFile = await uploadOnCloudinary(videoPath)
		 console.log(videoFile);
		 
	} catch (error) {
		console.log(error);
		
		throw new ApiError(400, 'Unable to upload video on cloudinary')
	}
	let thumbnail 
	try {
		thumbnail = await uploadOnCloudinary(thumbnailPath)
   } catch (error) {
		console.log(error);
	   throw new ApiError(400, 'Unable to upload thumbnail on cloudinary')
   }
	try {
		const video = await Video.create({
			title,
			description,
			videoFile: videoFile?.url,
			thumbnail: thumbnail?.url,
			duration: videoFile.duration.toFixed(2),
			views: 0,
			isPublished: false,
			owner: req.user
		  })

		  const uploadedVideo = await Video.findById(video._id).populate("owner")
		  console.log("uploadedVideo", uploadedVideo);
		  
		  if(!uploadedVideo){
			throw new ApiError(400, 'something went wrong while uploading video')
		  }
		  return res.status(200).json(new ApiResponse(200, uploadedVideo, "Video succesfully uploaded"))

	} catch (error) {
		console.log(`video upload failed!`, error)

		if(videoFile){
			const videoDelete = await deleteFromCloudinary(videoFile.public_id)
			console.log(videoDelete);
			
		}
		if(thumbnail){
			const thumbnailDelete = await deleteFromCloudinary(thumbnail.public_id)
			console.log(thumbnailDelete);
			
		}
		
		throw new ApiError(400, 'Unable to create video')
	}

})

// const getVideoById = asyncHandler(async (req, res) => {
//     const videoId = req.params.id
//     //TODO: get video by id
// 	const video = await Video.findById(videoId)
// 	const likes = getVideoLikes(videoId)
// 	console.log(likes);
	
// 	if(!video){
// 		throw new ApiError(400, 'Video not found!')
// 	}
	  
// 	return res.json(new ApiResponse(200, {video},'Video fetched!'))
// })

const updateVideo = asyncHandler(async (req, res) => {
	console.log(req);
	
    const videoId = req.params.id
	// const thumbnail = req.file?.path
	const {description, title} = req.body
	console.log(req.body);
	console.log(description);
	console.log(title);
    //TODO: update video details like title, description, thumbnail
	const video = await Video.findById(videoId)
	if(!video){
		throw new ApiError(400, 'Video not found!')
	}
	try {
		if(description){
			console.log(description);
			video.description = description
		}
		if(title){
			console.log(title);
			video.title = title
		}
		// if(thumbnail){
		// 	const thumbnail_public_id = extractPublicId(video.thumbnail)
		// 	const thumbnailDelete = await deleteFromCloudinary(thumbnail_public_id)
		// 	video.thumbnail = await uploadOnCloudinary(thumbnail)
		// }
		await video.save()
	} catch (error) {
		console.log(error);
		throw new ApiError(400, 'Error updating details!')
	}
	return res.json(new ApiResponse(201, {video}, 'Video updated succesfully!'))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.id
    //TODO: delete video
	const video = await Video.findById(videoId).populate("owner")
	if(!video){
		throw new ApiError(400, 'video not found!')
	}
	const video_public_id = extractPublicId(video.videoFile)
	const thumbnail_public_id = extractPublicId(video.thumbnail)
	console.log("video_public_id:", video_public_id);
	console.log("thumbnail_public_id:", thumbnail_public_id);
	
	
	try {
		try {
			const deleteVideo = await deleteFromCloudinary(video_public_id, 'video')
			console.log("deleteVideo", deleteVideo);
		} catch (error) {
			console.log(error)
			throw new ApiError(400, "Video couldn't be deleted")
		}
	
		try {
			
			const deleteThumbnail = await deleteFromCloudinary(thumbnail_public_id)
			console.log("deleteThumbnail", deleteThumbnail);
		} catch (error) {
			console.log(error)
			throw new ApiError(400, "thumbail couldn't be deleted")
			
		}
			const vid = await Video.findByIdAndDelete(videoId)
			return res.json(new ApiResponse(200 ,{vid},'Video deleted successfully'))
	} catch (error) {
		console.log(error)
		throw new ApiError(400, "Video couldn't be deleted")
	}
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const videoId  = req.params.id
	console.log(req.params.id);
	
	if(!videoId){
		throw new ApiError(400, 'videoId not found')
	}
	const video = await Video.findById(videoId)
	if(!video){
		throw new ApiError(400, 'video not found')
	}
	video.isPublished = !video.isPublished
	await video.save()
	console.log(video.isPublished);
	
	return res.status(200).json(new ApiResponse(200, {video}, 'Publish status updated!'))
	
})

const getVideoById = asyncHandler(async(req, res) => {
	const videoId = req.params.id

	const video = await Video.aggregate([
		{
		  $match: {
			_id: new mongoose.Types.ObjectId(videoId)
		  }
		},
		{
		  $lookup: {
			from: "likes",
			localField: "_id",
			foreignField: "video",
			as: "likes"
		  }
		},
		{
		  $addFields: {
			likeCount:{
				$size: "$likes"
			}
		  }
		},
		{
			$project:{
				title: 1,
				description: 1,
				duration: 1,
				views: 1,
				owner: 1,
				likeCount: 1,
				_id: 1
			}
		  }
	  ])
	
	
	  return res
	  	.status(200)
		.json(new ApiResponse(200, {video}, "Video fetched"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}