import mongoose, { mongo } from "mongoose"
import {Video} from "../models/videos.models.js"
import { User } from "../models/users.models.js"
import {Subscription} from "../models/subscriber.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/APIError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const id = req.params.id
    const videos = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $count: 'totalVideos'
        }
    ])
    const subscribers = await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $count: 'totalSubscribers'
        }
    ])
    const likes = await Like.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(req.user.id)
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
            $unwind: "$likes"
          },
        {
          $project: {
            likes: 1
          }
        },
        {
            $group: {
              _id: "$_id",
              totalLikes:{
              $sum : 1
            }
            }
        }
        
      ])
    const views = await User.aggregate([
        {
         $match: {
           _id: new mongoose.Types.ObjectId(req.user.id)
         } 
        },
        {
          $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "videos"
          }
        },
        {
          $unwind: "$videos"
        },
        {
          $group: {
            _id: null,
            totalViews: {
              $sum: "$videos.views"
            }
          }
        },
        {
          $project: {
            totalViews: 1
          }
        }
        
      ])
      console.log(
        videos.totalVideos
      );
    
    const result = {
        totalVideos: videos[0]?.totalVideos || 0, 
        totalSubscribers: subscribers[0]?.totalSubscribers || 0, 
        totalLikes: likes[0]?.totalLikes || 0, 
        totalViews: views[0]?.totalViews || 0
    }

    return res.status(200).json(new ApiResponse(200, {result}, "Dashboard fetched succesfully!"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const id = req.params.id
    console.log(id);
    
    const videos = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(id)
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200, {videos}, "Videos fetched succesfully!"))

})

export {
    getChannelStats, 
    getChannelVideos
    }