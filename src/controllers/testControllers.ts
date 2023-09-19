import {Request, Response} from "express";
import videos from "../models/video";

export const deleteAllVideos = (req: Request, res: Response) => {
    videos.length = 0
    res.status(204).send()
}