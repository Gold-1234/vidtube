import mongoose, { mongo, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

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

	this.password = await bcrypt.hash(this.password, 10)
	console.log("save", this.password);
	
	next()
})
userSchema.methods.isPasswordCorrect = async function(password){
	// console.log("running isPasswordCorrect");
	// console.log(this.password);
	// console.log("password to check", password);
	
	const result = await bcrypt.compare(password, this.password)
	// console.log("isPasswordCorrect: ",result);
	
	return result
}
userSchema.methods.generateAccessToken = function(){
	console.log('generateAccessToken');
	
	try {
		const jwtsign = jwt.sign(
			{
				_id: this._id,
				email: this.email,
				username: this.username,
				fullname: this.fullname
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_EXPIRY
			}
		)
		
		return jwtsign
		
	} catch (error) {
		console.log("this is the error:", error);
	}
}
userSchema.methods.generateRefreshToken = function(){
	console.log('generateRefreshToken');
	try {
		return jwt.sign(
			{
				_id: this._id,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: process.env.REFRESH_TOKEN_EXPIRY
			})
	} catch (error) {
		console.log(error);
		
	}
	
}

export const User = mongoose.model("User", userSchema)