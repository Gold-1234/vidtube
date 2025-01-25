import mongoose, { mongo, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
	{
	username: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		indexing: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	fullname:{
		type: String,
		required: true
	},
	avatar:{
		type: String,
		require: true
	},
	coverImage:{
		type: String,
	},
	watchHistroy:[
		{
			type: Schema.Types.ObjectId,
			ref: "Video"
		}
	],
	password:{
		type: String,
		required: [true, "password is required"]
	},
	refreshToken:{
		type: String
	}
  },
  {
	timestamps: true
  }
)

userSchema.pre("save", async function(next){

	if(!this.isModified("password")) return next()

	this.password = bcrypt.hash(this.password, 10)
	next()
})
userSchema.methods.isPasswordCorrect = async function(password){
	return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullname: this.fullname
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expriresIn: process.env.ACCESS_TOKEN_EXPIRY
		}
	)
}
userSchema.methods.generateRefereshToken = function(){
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expriresIn: process.env.REFRESH_TOKEN_EXPIRY
		}
	)
}

export const User = mongoose.model("User", userSchema)