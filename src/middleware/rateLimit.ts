import { NextFunction, Request, Response } from "express";
import { usersQueryRepository } from "../repositories/users/users-query-repo";
import { HttpStatusCodes as HTTP_STATUS } from "../helpers/httpStatusCodes";
import {userService} from "../domain/users-service";

export const rateLimitValidation = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const {ip, originalUrl} = req
        await userService.saveRequest(ip, originalUrl)
        try {
            const requests = await usersQueryRepository.findRequestByIpAndUrl(ip, originalUrl)
            console.log('requests', requests)

            if (Array.isArray(requests) && requests.length >= 5) {
                res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS)
            } else {
                next()
            }
        } catch (error) {
            console.error('Error in rate limit validation:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }
    }
}