import {NextFunction, Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";
import {JwtService} from "../../application/jwt-service";
import {UsersQueryRepository} from "../../repositories/users/users-query-repo";

export class AccessTokenChecker {
    constructor(protected jwtService: JwtService,
                protected usersQueryRepository: UsersQueryRepository) {
    }

    async checkToken(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1]
                const userId = await this.jwtService.verifyToken(token)
                if (!userId) {
                    return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
                }
                req.user = await this.usersQueryRepository.findUserById(userId)
                return next()
            } else {
                req.user = null
                return next()
            }

        } catch (error) {
            console.error('authWithToken error', error);
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }
    }
}