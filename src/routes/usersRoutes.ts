import express, {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {userService} from "../domain/users-service";

const usersRouter =  express.Router();

//usersRouter.get

usersRouter.post('/', async (req: Request, res: Response) => {
    const {login, password, email} = req.body
    const newUser = await userService.createUser({login, password, email})
    res.status(HTTP_STATUS.CREATED).send(newUser)
})

//usersRouter.delete

export default usersRouter