import {AddUserParams} from "../types/types";
import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users/users-db-repo";
import {v4 as uuidv4} from 'uuid'
import { add } from 'date-fns';
import {emailManager} from "../managers/email-manager";

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
        const res = usersRepository.registerUser(newUser)
        try {
            await emailManager.sendUserRegistrationMail(newUser)
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
}