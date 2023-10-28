import express, {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {userService} from "../domain/users-service";
import {createUserValidation} from "../middleware/users/createUserValidation";
import {getQueryParams} from "../helpers/query-params";
import {UsersQueryParams} from "../types";
import {usersQueryRepository} from "../repositories/users/users-query-repo";
import {basicAuth} from "../middleware/authorization";

const usersRouter =  express.Router();

usersRouter.get('/', basicAuth, async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);
    const searchLoginTerm = req.query.searchLoginTerm?.toString() || null
    const searchEmailTerm = req.query.searchEmailTerm?.toString() || null

    const getUserParams: UsersQueryParams = {
        searchLoginTerm,
        searchEmailTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    }

    const users = await usersQueryRepository.getUsers(getUserParams)
    res.send(users)
})

usersRouter.post('/', basicAuth, createUserValidation(),
    async (req: Request, res: Response) => {

    const {login, password, email} = req.body
    const newUser = await userService.createUser({login, password, email})
    res.status(HTTP_STATUS.CREATED).send(newUser)
})

usersRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    const isDeleted = await usersQueryRepository.removeUserById(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST)
    }
})
export default usersRouter