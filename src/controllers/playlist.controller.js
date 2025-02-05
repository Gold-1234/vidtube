import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/APIError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
   try {
     const playList = await Playlist.create({
         owner: req.user.id,
         name,
         description
     })
     if(playList){
         return res.json(new ApiResponse(200, {playList}, "Playlist created succesfully!"))
     }
   } catch (error) {
    console.log(error.message);
    
    return res.json(new ApiError(400, `Error creating Playlist: ${error}`))
   }
})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {id} = req.params
    //TODO: get user playlists
    const userId = req?.params.id || req.user._id;
    if(!userId){
        console.log("no userId");
    }
    try { 
        let userPlaylist = await Playlist.find({owner:userId})
        if (userPlaylist.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "No playlists found for this user"));
        }
        userPlaylist = await Playlist.find({owner:userId}).select("name description")
        return res.status(200).json(new ApiResponse(200, {userPlaylist}, "Playlists fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error getting Playlist: ${error.message}`));
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    try {
        const { playlistId } = req.params;

        if (!mongoose.isValidObjectId(playlistId)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid playlist ID format"));
        }

        const playlistById = await Playlist.findOne({ _id: playlistId })
                                .select("name description")
                                .populate(
                                    {
                                        path: "videos",
                                        select: "thumbnail title views description duration",
                                        populate: {
                                            path: "owner",
                                            select: "avatar username"
                                        }
                                    }
                                )


        if (!playlistById) {
            return res.status(404).json(new ApiResponse(404, null, "Playlist not found"));
        }

        return res.status(200).json(new ApiResponse(200, playlistById, "Playlist fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(400, `Error getting Playlist: ${error.message}`));
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if (!mongoose.isValidObjectId(playlistId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid playlist ID format"));
    }
    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid video ID format"));
    }
    
        try {   

            const play = await Playlist.findOne({videos: videoId})
            if(play){
                return res.status(200).json(new ApiResponse(200, {play}, "Video already in playlist"))
            }
                const playlist = await Playlist.findByIdAndUpdate(
                    {_id: playlistId},
                    {
                        $push:{
                            videos: videoId
                        }
                    },
                    {
                        new: true
                    }
                )
                console.log("playlist:", playlist);
                
                if(!playlist){
                    return new ApiError(404, "error playlist not found")
                }
                return res.status(200).json(new ApiResponse(200, {playlist}, "Video added succesfully"))
            
        } catch (error) {
                return res.status(200, null, `Error adding video to playlist ${error.message}`)
        }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    
    const owner = req.user.id
   try {
         const playlist = await Playlist.findOneAndUpdate(
                {_id: playlistId},
                {
                 $pull: {videos: videoId}
                },
                {new: true}
         )
         console.log(playlist);
         
     console.log(playlist);
     
     if(!playlist){
         throw new ApiError(404, "error removing video from playlist")
     }
     return res.status(200).json(new ApiResponse(200, {playlist}, "Video removed from playlist succesfully"))
   } catch (error) {
    console.log(error);
    
        return res.status(400).json(new ApiError (400, `error removing video from playlist ${error.message}`))
   }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

       try {
         if (!mongoose.isValidObjectId(playlistId)) {
             return res.status(400).json(new ApiResponse(400, null, "Invalid playlist ID format"));
         }
 
         const playlistById = await Playlist.deleteOne({ playlistId })
         console.log(playlistById);
         if(!playlistById){
            throw new ApiError(404, "playlist couldn't be deleted!")
         }
         return res.status(200).json(new ApiResponse(200, {playlist}, "Playlist deleted succesfully"))
       } catch (error) {
        return res.status(404).json(new ApiResponse(200, {playlist}, `Playlist couldn't be deleted ${error}`))
       }
        
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    try {
        const playlist = await Playlist.findOneAndUpdate    ({playlistId},
            {
                $set: {name, description}
            },
            {returnNewDocument: true}
        )
        if(!playlist){
            throw new ApiError(404, "error updating playlist")
        }
        return res.status(200).json(new ApiResponse(200, {playlist}, "updated playlist succesfully"))
      } catch (error) {
           return res.status(200, null, `Error updating playlist ${error.message}`)
      }
   
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}