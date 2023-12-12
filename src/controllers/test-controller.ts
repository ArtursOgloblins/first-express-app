import {TestRepository} from "../repositories/testRepository";
import {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";

export class TestController {
    constructor(protected testRepository: TestRepository) {
    }
    async deleteAllBeforeTest (req: Request, res: Response) {
        await this.testRepository.deleteAllBlogs()
        await this.testRepository.deleteAllPosts()
        await this.testRepository.deleteAllUsers()
        await this.testRepository.deleteAllComments()
        await this.testRepository.deleteAllTokens()
        await this.testRepository.deleteAllDevices()
        await this.testRepository.deleteAllCommentLikeStatuses()
        res.status(HTTP_STATUS.NO_CONTENT).send()
    }
}