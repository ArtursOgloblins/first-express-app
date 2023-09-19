import {Request, Response} from "express";
import videos from "../models/video";
import {validateInputPost, validateInputPut} from "../middleware/validateInput";


export const getVideos = (req: Request, res: Response) => {
    res.send(videos);
}

export const getVideoById = (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video){
        res.send(video)
    } else {
        res.sendStatus(404)
    }
}

export const deleteVideoById = (req: Request, res: Response) => {
    for (let i=0; i<videos.length; i++){
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.sendStatus(204)
            return;
        }
    }
    res.sendStatus(404)
}

export const addVideo = (req: Request, res: Response) => {

    const validation = validateInputPost(req.body);

    if (!validation.isValid) {
        return res.status(400).send({
            errorsMessages: validation.errors
        });
    }

    const today = new Date();
    const createdAt = today.toISOString()
    today.setDate(today.getDate() + 1);
    const publicationDate = today.toISOString();

    const newVideo = {

        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt,
        publicationDate: publicationDate,
        availableResolutions: req.body.availableResolutions
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
}

export const updateVideo = (req: Request, res: Response) => {

    const validation = validateInputPut(req.body);

    if (!validation.isValid) {
        return res.status(400).send({
            errorsMessages: validation.errors
        });
    }

    let video = videos.find(p => p.id === +req.params.id)
    if (video){
        video.title = req.body.title
        video.author = req.body.author
        video.canBeDownloaded = req.body.canBeDownloaded
        video.minAgeRestriction = req.body.minAgeRestriction
        if (!video.createdAt) {
            video.createdAt = (new Date()).toISOString();
        }
        video.publicationDate = req.body.publicationDate
        video.availableResolutions = req.body.availableResolutions

        res.status(204).send(video)
    } else {
        res.sendStatus(404)
    }
}