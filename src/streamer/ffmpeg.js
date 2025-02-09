import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";


// Define resolutions
const resolutions = [
  { name: "1080p", width: 1920, height: 1080, bitrate: "5000k" },
  { name: "720p", width: 1280, height: 720, bitrate: "2800k" },
  { name: "480p", width: 854, height: 480, bitrate: "1400k" },
  { name: "360p", width: 640, height: 360, bitrate: "800k" },
  { name: "240p", width: 426, height: 240, bitrate: "400k" },
];

const hlsConvert = (videoURL) => {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);

  // Output folder
  const outputFolder = "video/hls";
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  resolutions.forEach(({ name, width, height, bitrate }) => {
    const outputPath = path.join(outputFolder, `${name}.m3u8`);
    const segmentPath = path.join(outputFolder, `${name}_%03d.ts`);

    ffmpeg(videoURL, { timeout: 432000 })
      .outputOptions([
        `-vf scale=${width}:${height}`,
        `-b:v ${bitrate}`,
        "-c:v h264",
        "-preset veryfast",
        "-c:a aac",
        "-b:a 128k",
        "-hls_time 6",
        "-hls_list_size 0",
        "-hls_segment_filename", segmentPath,
        "-f hls",
      ])
      .output(outputPath)
      .on("start", (command) => console.log(`FFmpeg started for ${name}:`, command))
      .on("progress", (progress) =>
        console.log(`Processing ${name}: ${progress.percent}%`)
      )
      .on("error", (err) => console.error(`Error for ${name}:`, err.message))
      .on("end", () => console.log(`Conversion completed for ${name}!`))
      .run();
  });

  const masterPlaylist = `#EXTM3U
${resolutions
    .map(
      ({ name, width, height, bitrate }) =>
        `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(bitrate) * 1000},RESOLUTION=${width}x${height}
${name}.m3u8`
    )
    .join("\n")}`;

  fs.writeFileSync(path.join(outputFolder, "master.m3u8"), masterPlaylist);
  console.log("Master playlist created!");
};

export default hlsConvert;