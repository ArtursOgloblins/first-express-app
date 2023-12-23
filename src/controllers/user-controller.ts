import {UsersQueryRepository} from "../infrastructure/repositories/users/users-query-repo";
import {UsersService} from "../application/services/users-service";
import {Request, Response} from "express";
import {getQueryParams} from "../helpers/query-params";
import {UsersQueryParams} from "../types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {inject, injectable} from "inversify";


@injectable()
export class UserController {
    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UsersService) protected usersService: UsersService) {}

    async getAllUsers(req: Request, res: Response){
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

        const users = await this.usersQueryRepository.getUsers(getUserParams)
        res.send(users)
    }

    async addUser(req: Request, res: Response) {

        const {login, password, email} = req.body
        const newUser = await this.usersService.createUser({login, password, email})
        res.status(HTTP_STATUS.CREATED).send(newUser)
    }

    async deleteUserById(req: Request, res: Response) {
        const isDeleted = await this.usersQueryRepository.removeUserById(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }
}