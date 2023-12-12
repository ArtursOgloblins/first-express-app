import {AddUserParams, RefreshTokenParams} from "../types/types";
import bcrypt from "bcrypt";
import {UsersRepository} from "../repositories/users/users-db-repo";
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns';
import {emailManager} from "../managers/email-manager";
import {UsersQueryRepository} from "../repositories/users/users-query-repo";
import {UsersService} from "./users-service";
import {JwtService} from "../application/jwt-service";
import {AuthRepository} from "../repositories/auth/auth-db-repo";
import {jwtDateMapper} from "../helpers/mappers";
import {ObjectId} from "mongodb";
import {PasswordRecovery} from "../models/passwordRecovery";
import {AccountData, EmailConfirmation, User} from "../models/Users";
import {RefreshToken} from "../models/refreshToken";

export class AuthService {
    constructor(protected authRepository: AuthRepository,
                protected usersService: UsersService,
                protected usersRepository: UsersRepository,
                protected usersQueryRepository: UsersQueryRepository,
                protected jwtService: JwtService) {
    }

    async createUser(inputData: AddUserParams) {
        const {login, password, email} = inputData
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const createdAt = new Date().toISOString()
        const confirmationCode = uuidv4()
        const expirationDate = add(new Date(), {hours: 1, minutes: 3})

        const accountData = new AccountData(login, email, passwordHash, passwordSalt, createdAt)
        const emailConfirmation = new EmailConfirmation(confirmationCode, expirationDate, false)

        const newUser = new User(accountData, emailConfirmation)

        const res = await this.usersRepository.registerUser(newUser)

        try {
            await emailManager.sendUserRegistrationMail(newUser.emailConfirmation.confirmationCode, email)
        } catch (error) {
            console.log(error)
            return null
        }
        return res
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async confirmRegistration(code: string) {
        const user = await this.usersQueryRepository.getUserByRegistrationCode(code)
        if (!user) {
            return null
        }
        return await this.usersService.updateConfirmation(user._id)
    }

    async confirmationResending(email: string) {
        const user = await this.usersQueryRepository.getUserByEmail(email)
        console.log('user', user)
        if (!user) return null

        const newCode = uuidv4()

        try {
            await this.usersRepository.updateConfirmationCode(user._id, newCode)
            await emailManager.sendUserRegistrationMail(newCode, email)
            return true
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async saveRefreshToken(inputData: RefreshTokenParams) {
        const {userId, newRefreshToken, deviceId, ip, deviceName} = inputData
        const refreshTokenDetails = await this.jwtService.getRefreshTokenDetails(newRefreshToken)
        const createdAt =  jwtDateMapper(refreshTokenDetails.iat)
        const expiringAt = jwtDateMapper(refreshTokenDetails.exp)

        const newToken = new RefreshToken(createdAt, expiringAt, deviceId, ip, deviceName, userId)

        return await this.authRepository.addNewRefreshToken(newToken)
    }

    async sendPasswordRecoveryMail(email: string, userId: ObjectId) {
        const expirationDate = add(new Date(), { minutes: 20 }).toISOString()
        const confirmationCode = uuidv4()
        console.log('confirmationCode', confirmationCode)

        const newPasswordRecovery = new PasswordRecovery(userId, confirmationCode, expirationDate, true)

        const res = await this.usersRepository.registerPasswordRecovery(newPasswordRecovery)

        try {
            await emailManager.sendPasswordRecoveryCode(confirmationCode, email)
        } catch (error) {
            console.log(error)
            return null
        }
        return res
    }
}