import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import cookieParser from "cookie-parser"
import tweetRouter from "./routes/tweet.routes.js"
import commmentRouter from "./routes/comments.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playList.routes.js"
import subscriptionRouter from "./routes/subscritpion.routes.js"
import streamRouter from "./routes/videoStream.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
const app = express()

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true
	})
)

//common middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1/healthcheck', healthCheckRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/user/video', videoRouter)
app.use('/api/v1/user/tweet', tweetRouter)
app.use('/api/v1/user/video/comments', commmentRouter)
app.use('/api/v1/user/like', likeRouter)
app.use('/api/v1/user/playList', playlistRouter)
app.use('/api/v1/user/subscribe', subscriptionRouter)
app.use('/api/v1/user', dashboardRouter)
app.use('/api/v1/user/stream', streamRouter)

export { app }
