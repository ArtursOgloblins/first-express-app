import {NextFunction, Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";
import {JwtService} from "../../application/services/jwt-service";
import {UsersQueryRepository} from "../../infrastructure/repositories/users/users-query-repo";
import {inject, injectable} from "inversify";
import {UsersService} from "../../application/services/users-service";

@injectable()
export class AccessTokenChecker {
    constructor(@inject(JwtService)  protected jwtService: JwtService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
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

    checkTokenMiddleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.checkToken(req, res, next).catch(error => {
                console.error('Unhandled error in checkToken:', error);
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal Server Error');
            })
        }
    }
}