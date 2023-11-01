import express, {Request, Response} from "express";
import {userService} from "../domain/users-service";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {jwtService} from "../application/jwt-service";


const authRouter = express.Router()

authRouter.post('/login', async (req: Request, res: Response)=> {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user !== null) {
        const token = await jwtService.createJWT(user)
        res.send(token).status(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

export default authRouter