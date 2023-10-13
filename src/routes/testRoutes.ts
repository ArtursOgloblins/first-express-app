import express, {Request, Response} from "express";
import {testRepository} from "../repositories/testRepository";

const testRouter = express.Router();

testRouter.delete('/all-data', async (req:Request, res:Response) => {
    //testRepository.deleteAllVideos()
    await testRepository.deleteAllBlogs()
    await testRepository.deleteAllPosts()
    res.status(204).send()
})

export default testRouter