import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/APIError.js"
import { ApiResponse } from "../utils/APIResponse.js"
import { User } from "../models/users.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinaryUpload.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const generateAccessAndRefreshToken = async (userId) => {
  console.log("running generateAccessAndRefreshToken");
  
  try {
    const user = await User.findById(userId)
    console.log(user);
    
    if (!user) {
      throw new ApiError(400, "User couldn't be found")
    }
    
    
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
    
    
    try {
      user.refreshToken = refreshToken
      await user.save({
        validateBeforeSave: false,
      })
      return { accessToken, refreshToken }
    } catch (error) {
      console.log(error);
      
    }
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while genrating refresh and access token."
    )
  }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(402, "No refresh token")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(402, "Invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(402, "Expired refresh token")
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      )
  } catch (error) {
    console.log("error in refreshing access tokens", error);
    
  }
})

const registerUser = asyncHandler(async (req, res) => {
  console.log("register user running")

  const { fullname, email, username, password } = req.body

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (existingUser) {
    throw new ApiError(409, "User with email already exists")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverLocalPath = req.files?.coverImage[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file missing")
  }
  //   const coverImage = await uploadOnCloudinary(coverLocalPath)

  //   const avatar = await uploadOnCloudinary(avatarLocalPath)

  let avatar
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath)
  } catch (error) {
    console.log("Error uploading avatar", error)
    throw new ApiError(400, "Failed to upload Avatar")
  }

  let coverImage
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath)
  } catch (error) {
    console.log("Error uploading coverImage", error)
    throw new ApiError(400, "Failed to upload coverImage")
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar?.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    })
    await user.save()

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong, while registering user")
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered succesfully"))
  } catch (error) {
    console.log("user creation failed", error)

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id)
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id)
    }
    throw new ApiError(
      500,
      "Something went wrong, while registering user, Images deleted from cloudinary"
    )
  }
})

const loginUser = asyncHandler(async (req, res) => {
  //get data from body
  const { email, password } = req.body

  
  if (!email || !password) {
    throw new ApiError(404, "Both email and password and required")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, "User not found")
  }  
  //password validation
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid Password")
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  )

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!loggedInUser) {
    throw new ApiError(401, "User couldn't be found")
  }

  const options = {
    httpOnly: true, //cookie non modifiable from client
    secure: process.env.NODE_ENV === "production",
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  )

  const options = {
    httpOnly: true, //cookie non modifiable from client
    secure: process.env.NODE_ENV === "production",
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out succcessfull"))
})

const changePassword = asyncHandler(async (req, res) => {
  
  const {oldPassword, newPassword} = req.body
  // console.log(req.user);
  
  const user = req.user
  console.log(user);
  
  if(!user){
    throw new ApiError(401, "User not found")
  }
  const isPasswordValid = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordValid){
    throw new ApiError(401, "Old password is incorrect")
  }
  user.password = newPassword
  await user.save({validateBeforeSave: false})
  return res
        .status(200)
        .json(new ApiResponse(200, "Password changed"))

})

const getCurrUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user details"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
  try {
    console.log("updating avatar");
    
    const avatarLocalPath = req.file?.path
  
    if (!avatarLocalPath) {
      throw new ApiError(400, "File is required!")
    }
  
    const avatar = await uploadOnCloudinary(avatarLocalPath)
  
    if (!avatar.url) {
      throw new ApiError(401, "Error uploading avatar image")
    }
  
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken")
  
    res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated successfully"))
  } catch (error) {
    console.log(error)
  }
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const CoverImageLocalPath = req.file?.path

  if (!CoverImageLocalPath) {
    throw new ApiError(400, "File is required!")
  }

  const coverImage = await uploadOnCloudinary(CoverImageLocalPath)

  if (!coverImage.url) {
    throw new ApiError(401, "Error uploading avatar image")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken")

  res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params
  if (!username?.trim()) {
    throw new ApiError(400, "username required")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "MySubscribtions",
      },
    },
    {
      $addFields: {
		subscriberCount: {
			$size: "$subscribers"
		},
		channelsSubscribedToCount:{
			$size: "$MySubscriptions"
		},
		isSubscribed: {
			$cond: {
				if: {$in: [req.user?._id, "$subscribers.subscriber"]},
        then: true,
        else: false
			}
		}
	  },
    },
	{
		$project: {
			fullname: 1,
			username: 1,
			avatar: 1,
			subscriberCount: 1,
			channelsSubscribedToCount: 1,
			isSubscribed: 1,
			coverImage: 1
		}
	}
  ])

  if(!channel?.length){
    throw new ApiError(400, "Channel not found")
  }

  return res.status(200, channel[0], "user channel fetched")
})

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline:[
          {
            $lookup:{
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline:[
                {
                  $project:{
                    fullname: 1,
                    avatar: 1,
                    username: 1
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first: "owner"
              }
            }
          }
        ]
      }
    }
  ])
  if(!user) return new ApiError(400, "WatchHistory couldn't be retrievd")
    return res.status(200).json(new ApiResponse(200, user[0]?.watchHistory, "Watch History fetched successfully"))
})

export {
  registerUser,
  loginUser,
  logoutUser,
  generateAccessAndRefreshToken,
  changePassword,
  getCurrUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
  refreshAccessToken
}
