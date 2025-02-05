import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/APIError.js"
import { User } from "../models/users.models.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
	console.log("running verify jwt");

	try {
		const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
		
		if(!token){
			throw new ApiError(401, Unauthorized)
		}
		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

		const user = await User.findById(decodedToken?._id).select("-password, -refreshToken")
		if(!user)throw new ApiError(401, Unauthorized)
		req.user = user
		next()
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid access token")
	}
})