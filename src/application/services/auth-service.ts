import {AddUserParams, RefreshTokenParams} from "../../types/types";
import bcrypt from "bcrypt";
import {UsersRepository} from "../../infrastructure/repositories/users/users-db-repo";
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns';
import {emailManager} from "../managers/email-manager";
import {UsersQueryRepository} from "../../infrastructure/repositories/users/users-query-repo";
import {UsersService} from "./users-service";
import {JwtService} from "./jwt-service";
import {AuthRepository} from "../../infrastructure/repositories/auth/auth-db-repo";
import {jwtDateMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";
import {PasswordRecovery} from "../../domain/passwordRecovery";
import {AccountData, EmailConfirmation, User, UserModel} from "../../domain/Users";
import {RefreshToken} from "../../domain/refreshToken";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(@inject(AuthRepository) protected authRepository: AuthRepository,
                @inject(UsersService) protected usersService: UsersService,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(JwtService) protected jwtService: JwtService) {
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

        const newUser = UserModel.createUser(accountData, emailConfirmation)

        try {
            await this.usersRepository.save(newUser)
            await emailManager.sendUserRegistrationMail(newUser.emailConfirmation.confirmationCode, email)
            console.log('newUser', newUser )
            return newUser
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async confirmRegistration(code: string) {
        const user = await this.usersQueryRepository.getUserByRegistrationCode(code)
        console.log('user', user)
        if (!user) {
            return null
        }

        if (user.canBeConfirmed(code)) {
            user.confirmRegistration(code)
            return await this.usersRepository.save(user)
        }
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
