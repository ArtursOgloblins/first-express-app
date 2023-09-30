import express, {Request, Response} from "express";
import {testRepository} from "../repositories/testRepository";

const testRouter = express.Router();

testRouter.delete('/all-data', (req:Request, res:Response) => {
    //testRepository.deleteAllVideos()
    testRepository.deleteAllBlogs()
    testRepository.deleteAllPosts()
    res.status(204).send()
})

export default testRouter