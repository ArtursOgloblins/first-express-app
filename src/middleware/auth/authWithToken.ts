import {Request, Response, NextFunction} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../../helpers/httpStatusCodes";
import {jwtService} from "../../application/jwt-service";
import {usersQueryRepository} from "../../repositories/users/users-query-repo";

export const authWithToken = async (req:Request, res:Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {

        const user =  await usersQueryRepository.findUserById(userId)
        console.log('úser:', user)
        if(!user) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        req.user = user
        return next()
    }
   return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
}