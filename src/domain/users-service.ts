import bcrypt from 'bcrypt';
import {AddUserParams} from "../types";
import {usersRepository} from "../repositories/users/users-db-repo";

export const userService = {
    async createUser(inputData: AddUserParams) {
        const {login, password, email} = inputData
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const createdAt = new Date().toISOString()

        const newUser = {
            userName: login,
            email,
            passwordHash,
            createdAt
        }
        return usersRepository.createUser(newUser)
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}