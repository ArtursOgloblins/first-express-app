import { NextFunction, Request, Response } from "express";
import { UsersQueryRepository } from "../repositories/users/users-query-repo";
import { HttpStatusCodes as HTTP_STATUS } from "../helpers/httpStatusCodes";
import {UsersService} from "../domain/users-service";

export class RateLimit {
    constructor(protected userService: UsersService,
                protected usersQueryRepository: UsersQueryRepository) {
    }

    async rateLimitValidation(req: Request, res: Response, next: NextFunction) {
        const { ip, originalUrl } = req;
        await this.userService.saveRequest(ip, originalUrl);
        try {
            const requests = await this.usersQueryRepository.findRequestByIpAndUrl(ip, originalUrl);

            if (Array.isArray(requests) && requests.length > 5) {
                res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS);
            } else {
                return next();
            }
        } catch (error) {
            console.error('Error in rate limit validation:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }
}