import bcrypt from 'bcrypt';
import {AddUserParams} from "../types/types";
import {usersRepository} from "../repositories/users/users-db-repo";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns";
import {ObjectId} from "mongodb";

export const userService = {
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
                isConfirmed: true
            }
        }
        return await usersRepository.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.password == passwordHash) {
            return user
        }
        return null;
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async updateConfirmation(id: ObjectId) {
        return await usersRepository.updateUser(id)
    },

    async saveRequest(ip: string, url: string) {
        const date = new Date().toISOString()
        const saveRequestArgs = {ip, url, date}
        return await usersRepository.saveRequest(saveRequestArgs)
    },

    async updatePassword(userId: ObjectId, newPassword: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newPassword, passwordSalt)

        return await usersRepository.updateUserPassword(userId, passwordSalt, passwordHash)
    }
}



