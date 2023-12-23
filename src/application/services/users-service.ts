import bcrypt from 'bcrypt';
import {AddUserParams} from "../../types/types";
import {UsersRepository} from "../../infrastructure/repositories/users/users-db-repo";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns";
import {ObjectId} from "mongodb";
import {AccountData, EmailConfirmation, User} from "../../domain/Users";
import {ApiRequest} from "../../domain/Requests";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {
    }

    async createUser(inputData: AddUserParams) {
        const {login, password, email} = inputData
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const createdAt = new Date().toISOString()
        const confirmationCode = uuidv4()
        const expirationDate = add(new Date(), {hours: 1, minutes: 3})

        const accountData = new AccountData(login, email, passwordHash, passwordSalt, createdAt)
        const emailConfirmation = new EmailConfirmation(confirmationCode, expirationDate, true)

        const newUser = new User(accountData, emailConfirmation)

        return await this.usersRepository.createUser(newUser)
    }

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.password == passwordHash) {
            return user
        }
        return null;
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async updateConfirmation(id: ObjectId) {
        return await this.usersRepository.updateUserConfirmation(id)
    }

    async saveRequest(ip: string, url: string) {
        const date = new Date().toISOString()
        const saveRequestArgs = new ApiRequest(ip, url, date)
        return await this.usersRepository.saveRequest(saveRequestArgs)
    }

    async updatePassword(userId: ObjectId, newPassword: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newPassword, passwordSalt)

        return await this.usersRepository.updateUserPassword(userId, passwordSalt, passwordHash)
    }
}



