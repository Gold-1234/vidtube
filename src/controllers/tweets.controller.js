import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videos.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinaryUpload.js"
import { extractPublicId } from 'cloudinary-build-url'

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
	const {tweet} = req.body

	const user = req.user
	const newTweet = await 
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}