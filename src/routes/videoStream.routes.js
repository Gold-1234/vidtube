import fs from "fs"
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Router } from "express";
import hlsConvert from "../streamer/ffmpeg.js";
import { getVideoById } from "../controllers/videos.controller.js";
import { Video } from "../models/videos.models.js";

const streamRouter = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));


streamRouter.post("/convert/:id", async (req, res) => {
    const video = await Video.findById(req.params.id)
    // const { videoURL, videoName } = req.body;
    const videoURL = video.videoFile
  
    if (!videoURL) {
      return res.status(400).json({ error: "Video URL is required" });
    }
  
    console.log(`Converting video: ${videoURL}`);
    hlsConvert(videoURL)    

    res.json({ message: "Video conversion started", playlist: `/video/hls/master.m3u8` });
  });
  


export default streamRouter