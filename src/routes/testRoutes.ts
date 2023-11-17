import express, {Request, Response} from "express";
import {testRepository} from "../repositories/testRepository";
import { HttpStatusCodes as HTTP_STATUS }  from "../helpers/httpStatusCodes";

const testRouter = express.Router();

testRouter.delete('/all-data', async (req:Request, res:Response) => {
    //testRepository.deleteAllVideos()
    await testRepository.deleteAllBlogs()
    await testRepository.deleteAllPosts()
    await testRepository.deleteAllUsers()
    await testRepository.deleteAllComments()
    await testRepository.deleteAllTokens()
    res.status(HTTP_STATUS.NO_CONTENT).send()
})

export default testRouter