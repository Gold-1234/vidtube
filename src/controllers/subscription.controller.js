import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/users.models.js";
import { Subscription } from "../models/subscriber.models.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const {channelId} = req.params;
  // TODO: toggle subscription
  const subscriber = req.user.id;
  try {
    if(channelId === subscriber){
        return res
        .status(200)
        .json(new ApiResponse(200, "Can't subscribe to self channel!"));
    }
    const sub = await Subscription.findOne({
      subscriber: subscriber,
      channel: channelId,
    });
    if(sub){
      try {
        const subs = await Subscription.findByIdAndDelete(sub.id);
        return res
          .status(200)
          .json(new ApiResponse(200, { subs }, "unsubscribed!"));
      } catch (error) {
        return res
          .status(400)
          .json(new ApiResponse(200, { error }, "unsubscribed!"));
      }
    }
    const subscription = await Subscription.create({
      subscriber: subscriber,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { subscription }, "Subscribed successfully!"));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Error subscribing", error));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const {channelId}  = req.params;
  const subscribers = await Subscription.aggregate([
        {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId)
        }
        },
        {
            $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscribers"
            }
          },
          {
            $unwind: "$subscribers"
          },
          {
            $project: {
              "subscribers._id": 1,
              "subscribers.username": 1,
              "subscribers.email": 1,
              "subscribers.fullname":1
            }
          }
  ])
  return res.status(200).json(new ApiResponse(200, {subscribers}, "Subscribers fetched successfully"))
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
    const subscriberTo = await Subscription.aggregate(
        [
            {
              $match: {
                subscriber: new mongoose.Types.ObjectId('679e4138a0f4102e8536e7c7')
              }
            },
          {
             $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedTo"
              }
           },
            {
              $unwind: "$subscribedTo"
            },
            {
                $project: {
                    "subscribedTo._id": 1,
                    "subscribedTo.username": 1,
                    "subscribedTo.email": 1,
                    "subscribedTo.fullname":1
                    }
             }
                    
          ]
    )
    return res.status(200).json(new ApiResponse(200, {subscriberTo}, "Subscriptions fetched successfully"))
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
