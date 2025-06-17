# VidTube API Documentation

This document provides comprehensive information about the VidTube API endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### User Authentication

#### 1. Register User
```
POST /auth/register
```

**Request Body**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**Response**
```json
{
    "success": true,
    "message": "User registered successfully",
    "token": "jwt-token"
}
```

#### 2. Login User
```
POST /auth/login
```

**Request Body**
```json
{
    "email": "string",
    "password": "string"
}
```

**Response**
```json
{
    "success": true,
    "message": "Login successful",
    "token": "jwt-token"
}
```

### Video Management

#### 1. Upload Video
```
POST /videos/upload
```

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Request Body** (multipart/form-data)
- `video`: Video file
- `thumbnail`: Thumbnail image (optional)
- `title`: string
- `description`: string
- `category`: string
- `tags`: array of strings

**Response**
```json
{
    "success": true,
    "message": "Video uploaded successfully",
    "video": {
        "_id": "video-id",
        "title": "string",
        "url": "video-url",
        "thumbnail": "thumbnail-url",
        "duration": "string",
        "createdAt": "timestamp"
    }
}
```

#### 2. Get Video Details
```
GET /videos/:videoId
```

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Response**
```json
{
    "success": true,
    "video": {
        "_id": "video-id",
        "title": "string",
        "description": "string",
        "url": "video-url",
        "thumbnail": "thumbnail-url",
        "duration": "string",
        "views": number,
        "likes": number,
        "dislikes": number,
        "createdAt": "timestamp"
    }
}
```

### User Profile

#### 1. Get User Profile
```
GET /users/profile
```

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Response**
```json
{
    "success": true,
    "user": {
        "_id": "user-id",
        "username": "string",
        "email": "string",
        "profilePicture": "url",
        "videos": [array of video objects],
        "subscribers": number,
        "subscriptions": number
    }
}
```

### Video Interaction

#### 1. Like/Dislike Video
```
POST /videos/:videoId/like
```

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Request Body**
```json
{
    "action": "like" | "dislike"
}
```

**Response**
```json
{
    "success": true,
    "message": "Video liked/disliked successfully",
    "likes": number,
    "dislikes": number
}
```

### Search

#### 1. Search Videos
```
GET /videos/search
```

**Query Parameters**
- `query`: Search term
- `category`: Optional category filter
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Response**
```json
{
    "success": true,
    "results": {
        "total": number,
        "videos": [array of video objects]
    }
}
```

## Error Responses

All error responses follow this format:

```json
{
    "success": false,
    "message": "Error message",
    "error": {
        "code": "error-code",
        "details": "additional details"
    }
}
```

## Rate Limiting

- 100 requests per minute per IP address
- 1000 requests per hour per IP address
- 10000 requests per day per IP address

## Security

- All requests must be made over HTTPS in production
- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt
- File uploads are validated for size and type
- Input is sanitized to prevent XSS attacks

## Versioning

The API uses semantic versioning in the URL:
```
/api/v1/
```

## Example Usage

```javascript
// Example using axios
const axios = require('axios');

// Login
const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
    email: 'user@example.com',
    password: 'password123'
});

const token = loginResponse.data.token;

// Get user profile
const profileResponse = await axios.get('http://localhost:3000/api/users/profile', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## API Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

