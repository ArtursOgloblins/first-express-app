import express, {Request, Response} from "express";
import {userService} from "../domain/users-service";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";

const authRouter = express.Router()

authRouter.post('/login', async (req: Request, res: Response)=> {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (checkResult) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

export default authRouter