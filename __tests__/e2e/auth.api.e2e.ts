import request from "supertest";
import mongoose from 'mongoose';
import {RouterPath} from "../../src/routerPaths";
import {AddUserParams} from "../../src/types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
import {UsersQueryRepository} from "../../src/infrastructure/repositories/users/users-query-repo";
// @ts-ignore
import {authTestManager} from "../utils/authTestmanager"

const app = initApp()

// const loginSeveralUsers = (count: number) => {
//     let users = []
//     for (let i = 0; i<count; i++) {
//         //const res = await login()
//         users.push
//     }
//
//     return users
// }

jest.mock('../../src/application/managers/email-manager', () => ({
    emailManager: {
        sendUserRegistrationMail: jest.fn().mockResolvedValue(true),
    },
}));

describe('tests for /auth registration', () => {
    const mongoURI = 'mongodb://0.0.0.0:27017/test_db'
    let newUser: any
    let newUser1: any
    const usersQueryRepository = new UsersQueryRepository()

    beforeAll(async () => {

        //tokens = await loginSomeUsers()

        await mongoose.connect(mongoURI)
            .then(() => console.log("MongoDB successfully connected"))
            .catch(err => console.error("MongoDB connection error: ", err))

        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
    }, 10000)

    afterAll(async () => {
        await mongoose.connection.close()
    })

    it('should fail to register a user with an incorrect email format', async () => {
        const userDataWithInvalidEmail: AddUserParams = {
            login: "JaneDoe",
            password: "password123",
            email: "invalid-email"
        }

        const response = await request(app)
            .post(`${RouterPath.auth}/registration`)
            .send(userDataWithInvalidEmail)

        expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
        expect(response.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Invalid email format'
                })
            ])
        );
    })

    it('should register new users', async () => {
       const userData = {
            login: "JohnDoe",
            password: "password123",
            email: "artur0_g@proton.me"
        }

        const userData1 = {
            login: "JaneDoe",
            password: "password123",
            email: "jane@doe.com"
        }
        const response = await authTestManager.registerUser(userData)
        const response1 = await authTestManager.registerUser(userData1)


        expect(response.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
        expect(response1.statusCode).toBe(HTTP_STATUS.NO_CONTENT)

        newUser = await usersQueryRepository.getUserByLogin(userData.login)
        newUser1 = await usersQueryRepository.getUserByLogin(userData1.login)
    })


    it ('should fail registration when sending invalid registration code', async () => {
        const invalidConfirmationCode = '12345'

        const response = await request(app)
            .post(`${RouterPath.auth}/registration-confirmation`)
            .send({code: invalidConfirmationCode})

        expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
    })


    it ('should confirm users registration', async () => {

        const confirmationCode = newUser.emailConfirmation.confirmationCode
        const confirmationCode1 = newUser1.emailConfirmation.confirmationCode

        const response = await authTestManager.confirmRegistration(confirmationCode)
        const response1 = await authTestManager.confirmRegistration(confirmationCode1)


        expect(response.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
        expect(response1.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
    })

    it('should login user successfully', async () => {
        const credentialsUser = {
            loginOrEmail: newUser.accountData.login,
            password: "password123"
        }

        const credentialsUser1 = {
            loginOrEmail: newUser1.accountData.login,
            password: "password123"
        }

        const token = authTestManager.loginUser(credentialsUser)
        const token1 = authTestManager.loginUser(credentialsUser1)

        expect(token).toBeDefined()
        expect(token1).toBeDefined()
    })

    // it('should refresh the token successfully', async () => {
    //
    //     const response = await request(app)
    //         .post(`${RouterPath.auth}/refresh-token`)
    //         .set('Cookie', `refreshToken=${refreshToken}`)
    //         .send();
    //
    //     expect(response.statusCode).toBe(HTTP_STATUS.OK);
    //     expect(response.text).toBeDefined(); // Check for new access token in response body
    //     const refreshTokenCookie = response.headers['set-cookie']
    //         .some((cookie: string) => cookie.startsWith('refreshToken='));
    //     expect(refreshTokenCookie).toBeTruthy()
    // })

    // it ('should logout the user', async () => {
    //     const response = await request(app)
    //         .post(`${RouterPath.auth}/logout`)
    //         .set('Cookie', `refreshToken=${token}`)
    //         .send()
    //
    //     expect(response.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
    // })
})

