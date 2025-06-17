# VidTube - A YouTube-like Video Platform
[![Run in Postman](https://run.pstmn.io/button.svg)](https://.postman.co/workspace/My-Workspace~8e34ee0b-2a3b-4de6-82f5-3528760f0bd7/collection/40785574-9041a15e-3de7-4e1c-bad5-74e5347344d8?action=share&creator=40785574)

VidTube is a modern video sharing platform built with Node.js and Express.js, offering a comprehensive set of features for video sharing, user interaction, and content management.

## Features

### Core Features
- User Authentication & Authorization
  - Secure registration and login system
  - JWT-based authentication
  - Password hashing with bcrypt

- Video Management
  - Video upload and processing
  - HLS streaming support
  - Video metadata management
  - Video categorization

- Media Processing
  - Video transcoding using FFmpeg
  - Image processing for thumbnails
  - Cloudinary integration for media storage

### User Features
- User profiles and management
- Video upload and sharing
- Like/dislike functionality
- Comment system
- Social interaction features
- Video search and discovery

### Technical Features
- RESTful API architecture
- MongoDB integration with Mongoose
- File upload handling with Multer
- CORS support for cross-origin requests
- Cookie-based session management
- Environment variable configuration

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- FFmpeg for video processing
- Cloudinary for media storage
- JWT for authentication
- bcrypt for password hashing

### Dependencies
```json
{
  "@ffmpeg-installer/ffmpeg": "^1.1.0",
  "bcrypt": "^5.1.1",
  "cloudinary": "^2.5.1",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "ejs": "^3.1.10",
  "express": "^4.21.2",
  "fluent-ffmpeg": "^2.1.3",
  "hls-server": "^1.5.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.9.5",
  "multer": "^1.4.5-lts.1"
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- FFmpeg
- Cloudinary account

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/vidtube.git
```

2. Install dependencies
```bash
cd vidtube
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

Detailed API documentation is available in the `API.md` file.

## Acknowledgments
- FFmpeg for video processing capabilities
- Cloudinary for media storage and management
- Express.js for the robust web framework
- MongoDB for scalable database solution

