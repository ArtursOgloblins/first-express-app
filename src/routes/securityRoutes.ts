import express from "express";
import {RefreshTokenValidation} from "../middleware/auth/refreshTokenValitation";
import {securityController} from "../composition-root";

const securityRouter = express.Router()

const refreshTokenValidation = new RefreshTokenValidation();

securityRouter.get('/devices', refreshTokenValidation.checkRefreshToken, securityController.getActiveDevices.bind(securityController))
securityRouter.delete('/devices', refreshTokenValidation.checkRefreshToken, securityController.deleteNonActiveDevices.bind(securityController))
securityRouter.delete('/devices/:deviceId', refreshTokenValidation.checkRefreshToken, securityController.deleteDeviceById.bind(securityController))

export default securityRouter