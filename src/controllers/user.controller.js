import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/APIError.js"
import { ApiResponse } from "../utils/APIResponse.js"
import { User } from "../models/users.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinaryUpload.js"

const registerUser = asyncHandler(async (req, res) => {
	console.log("register user running");
	
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

  let avatar;
  try {
	avatar = await uploadOnCloudinary(avatarLocalPath)
  } catch (error) {
	console.log("Error uploading avatar", error)
	throw new ApiError(400, "Failed to upload Avatar")
  }

  let coverImage;
  try {
	coverImage = await uploadOnCloudinary(coverLocalPath)
  } catch (error) {
	console.log("Error uploading coverImage", error)
	throw new ApiError(400, "Failed to upload coverImage")
  }

  try {
	const user = await User.create({
	    fullname,
	    avatar: avatar.url,
	    coverImage: coverImage?.url || "",
	    email,
	    password,
	    username: username.toLowerCase(),
	  })
	
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
	console.log("user creation failed", error);

	if(avatar){
		await deleteFromCloudinary(avatar.public_id)
	}
	if(coverImage){
		await deleteFromCloudinary(coverImage.public_id)
	}
	throw new ApiError(500, "Something went wrong, while registering user, Images deleted from cloudinary")
  }
})

export { registerUser }
