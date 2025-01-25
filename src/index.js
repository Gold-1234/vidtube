import { app } from "./app.js"
import dotenv, { configDotenv } from "dotenv"
import { connectDB } from "./db/index.js"
import { connect } from "mongoose"

dotenv.config({
	path: "./.env"
})

const PORT = process.env.PORT || 8001

connectDB()
.then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	  })
})
.catch((error) => {
	console.log("MongoDB connection error", error);
	
})


