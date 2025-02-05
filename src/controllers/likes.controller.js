import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/APIError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {id} = req.params
    //TODO: toggle like on video
    const user = req.user.id
    const like = await Like.findOneAndDelete({
        likedBy: user,
        video: id
    })
    if(!like){
        const createdLike = await Like.create({
            likedBy: user,
            video: id
        })
        const like = await Like.findById(createdLike.id)
        console.log(like);
        
        return res.json(new ApiResponse(200, {like}, "Liked!"))
    }
    return res.json(new ApiResponse(200, "Unliked!"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {id} = req.params
    const user = req.user.id
    const like = await Like.findOneAndDelete({
        likedBy: user,
        comment: id
    })
    if(!like){
        const createdLike = await Like.create({
            likedBy: user,
            comment: id
        })
        const like = await Like.findById(createdLike.id)
        console.log(like);
        
        return res.json(new ApiResponse(200, {like}, "Liked!"))
    }
    return res.json(new ApiResponse(200, "Unliked!"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {id} = req.params
    const user = req.user.id
    const like = await Like.findOneAndDelete({
        likedBy: user,
        tweet: id
    })
    if(!like){
        const createdLike = await Like.create({
            likedBy: user,
            tweet: id
        })
        const like = await Like.findById(createdLike.id)
        console.log(like);
        
        return res.json(new ApiResponse(200, {like}, "Liked!"))
    }
    return res.json(new ApiResponse(200, "Unliked!"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    console.log(req.user.id);
    
    const id = req.user.id
    const likedVideos = await Like.aggregate([
        {
          $match: {
            likedBy: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $match: {
            video: {$exists: true}
          }
        },
        {
          $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "videos"
          }
        },
        {
            $unwind: {
              path: "$videos",
              preserveNullAndEmptyArrays: true
            }
          },
        {
          $project: {
            "videos": 1
          }
        }
      ])
      if(!likedVideos){
        throw new ApiError(404, "Likes not found!")
      }
      return res.json(new ApiResponse(200, {likedVideos}, "Liked videos fetched succesfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}