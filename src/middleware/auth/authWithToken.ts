import {Request, Response, NextFunction} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";
import {JwtService} from "../../application/jwt-service";
import {UsersQueryRepository} from "../../repositories/users/users-query-repo";

export class TokenAuthenticator {
    constructor(protected jwtService: JwtService,
                protected usersQueryRepository: UsersQueryRepository) {
    }

    async authWithToken(req:Request, res:Response, next: NextFunction) {
        if(!req.headers.authorization) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            const userId = await this.jwtService.verifyToken(token)

            if (!userId) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }

            const user = await this.usersQueryRepository.findUserById(userId);
            if(!user) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)

            req.user = user
            return next()
        } catch (error) {
            console.error('authWithToken error', error);
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }
    }
}

