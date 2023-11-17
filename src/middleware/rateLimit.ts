import { NextFunction, Request, Response } from "express";
import { usersQueryRepository } from "../repositories/users/users-query-repo";
import { HttpStatusCodes as HTTP_STATUS } from "../helpers/httpStatusCodes";

export const rateLimitValidation = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip
        const url = req.baseUrl
        try {
            const requests = await usersQueryRepository.findRequestByIpAndUrl(ip, url)
            console.log('requests', requests)

            if (requests && requests.length > 5) {
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