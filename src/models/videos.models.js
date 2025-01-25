import mongoose, { Schema }from "mongoose";
import mongooseAggeregatePaginate from "mongoose-aggeregate-paginate-v2"

const videoSchema = new Schema({
	videoFile:{
		type: String,
		required: true
	},
	thumbnail:{
		type: String,
		required: true
	},
	title:{
		type: String,
		required: true
	},
	description:{
		type: String,
	},
	duration:{
		type: Number,
		required: true
	},
	views:{
		type: Number,
		required: true
	},
	views:{
		type: Number,
		required: true
	},
	isPublished:{
		type: Boolean,
		default: true
	},
	owner:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
},{timestamps: true})

videoSchema.plugin(mongooseAggeregatePaginate)

export const Video = mongoose.model("Video", videoSchema)