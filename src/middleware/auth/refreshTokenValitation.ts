import {Request, Response, NextFunction} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";

export class RefreshTokenValidation {
    async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
        next()
    }
}

