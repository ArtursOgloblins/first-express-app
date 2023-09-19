import express, { Request, Response} from "express";
import {videosRepository} from "../repositories/videos/videosRepository";
import {createVideoValidation, updateVideoValidation} from "../middleware/videoMiddleware";



const videoRouter = express.Router();

videoRouter.get('/', (req: Request, res: Response) => {
    const videos = videosRepository.getVideos()
    res.send(videos);
})

videoRouter.get('/:id',(req: Request, res:Response) => {
    const video = videosRepository.getVideoById(+req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(404)
    }
})

videoRouter.delete('/:id', (req: Request, res: Response) => {
    const isDeleted = videosRepository.deleteVideoById(+req.params.id)
    if (isDeleted){
        res.sendStatus(204)
    } else {
        res.status(404)
    }
})


videoRouter.post('/', createVideoValidation, (req: Request, res: Response) => {
    const {title, author, availableResolutions} = req.body
    const newVideo = videosRepository.createVideo({title, author, availableResolutions})
    return res.status(201).send(newVideo)
})


videoRouter.put('/:id', updateVideoValidation, (req: Request, res: Response) =>{
    const id = +req.params.id
    const {title, author, availableResolutions,canBeDownloaded, minAgeRestriction, publicationDate} = req.body
    const updatedVideo = videosRepository.updateVideo({id, title, author, availableResolutions,canBeDownloaded, minAgeRestriction, publicationDate})
    if (updatedVideo) {
        res.status(204).send(updatedVideo)
    } else {
        res.sendStatus(404)
    }
})

export default videoRouter
