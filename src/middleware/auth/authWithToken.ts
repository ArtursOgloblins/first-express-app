import {Request, Response, NextFunction} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";
import {JwtService} from "../../application/services/jwt-service";
import {UsersQueryRepository} from "../../infrastructure/repositories/users/users-query-repo";
import {inject, injectable} from "inversify";
import {UsersService} from "../../application/services/users-service";

@injectable()
export class TokenAuthenticator {
    constructor(@inject(JwtService) protected jwtService: JwtService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
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
    authWithTokenMiddleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.authWithToken(req, res, next).catch(error => {
                console.error('Unhandled error in authWithToken:', error)
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal Server Error');
            })
        }
    }
}

