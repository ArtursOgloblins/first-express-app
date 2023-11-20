import {AddUserParams, RefreshTokenParams} from "../types/types";
import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users/users-db-repo";
import {v4 as uuidv4} from 'uuid'
import { add } from 'date-fns';
import {emailManager} from "../managers/email-manager";
import {usersQueryRepository} from "../repositories/users/users-query-repo";
import {userService} from "./users-service";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth/auth-db-repo";
import {jwtDateMapper} from "../helpers/mappers";

export const authService = {
    async createUser(inputData: AddUserParams) {
        const {login, password, email} = inputData
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const createdAt = new Date().toISOString()

        const newUser = {
            accountData:{
                login: login,
                email: email,
                password: passwordHash,
                passwordSalt: passwordSalt,
                createdAt: createdAt
            },
            emailConfirmation: {
                confirmationCode:uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const res = await usersRepository.registerUser(newUser)
        const code = newUser.emailConfirmation.confirmationCode
        try {
            await emailManager.sendUserRegistrationMail(code, email)
        } catch (error) {
            console.log(error)
            // await usersRepository.deleteUserById(newUser._id)
            return null
        }
        return res
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async confirmRegistration(code: string) {
        const user = await usersQueryRepository.getUserByRegistrationCode(code)
        if (!user) {
            return null
        }
        return await userService.updateConfirmation(user._id)
    },

    async confirmationResending(email: string) {
        const user = await usersQueryRepository.getUserByEmail(email)
        console.log('user', user)
        if (!user) return null

        const newCode = uuidv4()
        console.log('newCode', newCode)

        try {
            await usersRepository.updateConfirmationCode(user._id, newCode)
            await emailManager.sendUserRegistrationMail(newCode, email)
            return true
        } catch (error) {
            console.log(error)
            return null
        }
    },

    async saveRefreshToken(inputData: RefreshTokenParams) {
        const {userId, newRefreshToken, deviceId, ip, deviceName} = inputData
        const refreshTokenDetails = await jwtService.getRefreshTokenDetails(newRefreshToken)

        const newToken = {
            createdAt:  jwtDateMapper(refreshTokenDetails.iat),
            expiringAt: jwtDateMapper(refreshTokenDetails.exp),
            deviceId: deviceId,
            ip: ip,
            deviceName: deviceName,
            userId: userId
        }
        console.log("New token:", newToken);
        return await authRepository.addNewRefreshToken(newToken)
    }
}