import express, {Request, Response} from "express";
import {userService} from "../domain/users-service";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {jwtService} from "../application/jwt-service";
import {authWithToken} from "../middleware/auth/authWithToken";
import {createUserValidation} from "../middleware/users/createUserValidation";

const authRoutes = express.Router()

authRoutes.post('/registration',createUserValidation(),
    async (req: Request, res: Response) => {

    const {login, password, email} = req.body
    const newUser = await userService.createUser({login, password, email})
        if (newUser) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }

})

authRoutes.post('/login', async (req: Request, res: Response)=> {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user !== null) {
        const token = await jwtService.createJWT(user)
        res.send(token).status(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.get('/me', authWithToken, async(req: Request, res: Response) => {
    const currentUser = {
        email: req.user!.accountData.email,
        login: req.user!.accountData.login,
        userId: req.user!._id.toString()
    }
    res.status(HTTP_STATUS.OK).send(currentUser);
})

export default authRoutes