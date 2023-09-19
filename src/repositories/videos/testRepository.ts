import {db, Video} from "../../models/video";


export const testRepository = {
    deleteAllVideos(): Video[]  {
        db.videos.length = 0
        return db.videos
    }
}
