import { app } from "./app.js"
import dotenv, { configDotenv } from "dotenv"
import { connectDB } from "./db/index.js"
import { connect } from "mongoose"
import hls from "hls-server"

dotenv.config({
	path: "./.env"
})

const PORT = process.env.PORT || 8001
let server

connectDB()
.then(() => {
	 server = app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	  })
	  new hls(server, {
		provider: {
			exists: (req, cb) => {
				const ext = req.url.split('.').pop(); // Get file extension
			
				if (ext !== 'm3u8' && ext !== 'ts') {
					return cb(null, true); // Only allow .m3u8 and .ts files
				}
				fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
					if (err) {
						console.log('File not exist');
						return cb(null, false); // File does not exist
					}
					cb(null, true); // File exists
				})
			},
			getManifestStream: (req, cb) => {
				const stream = fs.createReadStream(__dirname + req.url);
				cb(null, stream);
			},
			getSegmentStream: (req, cb) => {
				const stream = fs.createReadStream(__dirname + req.url);
				cb(null, stream);
			}
		}
	})
})
.catch((error) => {
	console.log("MongoDB connection error", error);
	
})

export default server



