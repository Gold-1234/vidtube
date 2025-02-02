import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async() => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
		console.log(`\n mongoDB connected! DB host: ${connectionInstance.connection.host}`);
		// console.log(connectionInstance);
		mongoose.connection.on('connected', () => console.log('MongoDB connected.'));
		mongoose.connection.on('error', (err) => console.error(`MongoDB connection error: ${err}`));	
	} catch (error) {
		console.log("MongoDB connection error: ", error);
		process.exit(1)
	}
}

export {connectDB}