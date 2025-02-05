import mongoose, {isValidObjectId} from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/APIError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinaryUpload.js"
import { extractPublicId } from 'cloudinary-build-url'

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
	const {tweet} = req.body
    console.log(tweet);
    
	const user = req.user

	try {
        const newTweet = await Tweet.create({
                owner : user._id,
                content : tweet
            })
            
            
        const fetchedTweet = await Tweet.findById(newTweet._id)
            
       return res.json(new ApiResponse(200, fetchedTweet, "Tweet posted succesfully!"))
    } catch (error) {
        console.log(error);
        throw new ApiError(400, "Tweet couldn't be posted!")
    }

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const id = req.user._id
   try {
     const tweets = await Tweet.aggregate([
         {
             $match: {
                 owner: new mongoose.Types.ObjectId(id)
             }
         }
       ])
       if(tweets){
         return res.json(new ApiResponse(200, {tweets}, "Tweets fetched succesfully"))
       }
   } catch (error) {
        throw new ApiError(400, "tweets couldn't be found!", error)    
   }
})


const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const newContent = req.body.newContent
    const id =  req.params.id
   try {
        const tweet = await Tweet.findById(id)
        if(!tweet){
            throw new ApiError(400, "tweet couldnt be found!")
        }
        tweet.content = newContent
        await tweet.save({validateBeforeSave: false})
        const updatedTweet = await Tweet.findById(id)
        return res.json(new ApiResponse(200, {updatedTweet},"Tweet updated successfully!!"))
   } catch (error) {
        console.log(error);
        throw new ApiError(400, "tweet couldn't be saved!", error)    
   }

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const id =  req.params
        const tweet = await Tweet.findByIdAndDelete(id)
        if(!tweet){
            throw new ApiError(404, "tweet couldnt be found!")
        }
        return res.json(new ApiResponse(200, {tweet},"Tweet deleted successfully!!"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}