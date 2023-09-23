import express, {Request, Response} from "express";
import {testRepository} from "../repositories/videos/testRepository";

const testRouter = express.Router();

testRouter.delete('/all-data', (req:Request, res:Response) => {
    testRepository.deleteAllVideos()
    testRepository.deleteAllBlogs()
    res.status(204).send()
})

export default testRouter