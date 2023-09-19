import {db, Video} from "../../models/video";
import {CreateVideoAttr, UpdateVideoAttr} from "../../types";

export const videosRepository = {
    getVideos(): Video[] {
        return db.videos
    },

    createVideo(inputData: CreateVideoAttr): Video {
        const today = new Date();
        const createdAt = today.toISOString()
        today.setDate(today.getDate() + 1);
        const publicationDate = today.toISOString();

        const newVideo = {
            id: +(new Date()),
            title: inputData.title,
            author: inputData.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt,
            publicationDate: publicationDate,
            availableResolutions: inputData.availableResolutions
        }
        db.videos.push(newVideo)
        return newVideo
    },

     getVideoById(id: number): Video {
         return <Video>db.videos.find(v => v.id === id)
    },

    deleteVideoById(id: number): boolean {
        for (let i = 0; i < db.videos.length; i++) {
            if (db.videos[i].id === id) {
                db.videos.splice(i, 1)
                return true;
            }
        }
        return false
    },

    updateVideo(inputData: UpdateVideoAttr): Video | null {
        const videoIndex = db.videos.findIndex(v => v.id === inputData.id)
        const {id, ...dataToUpdate} = inputData

        if (videoIndex === -1) return null

        const updatedVideo: Video = {
            ...db.videos[videoIndex],
                ...dataToUpdate,
            createdAt: new Date().toISOString()
        }

        db.videos[videoIndex] = updatedVideo;

        return updatedVideo
    }
}