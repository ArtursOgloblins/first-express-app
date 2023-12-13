import {Request, Response, NextFunction} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";

export class RefreshTokenValidation {
    async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
        return next()
    }
}

//req.headers.accessToken
//!accessToke -> req.user = null -> next()
// accessToken -> user -> ? user in bd -> req.user = null / req.user = userFromBd -> next()

