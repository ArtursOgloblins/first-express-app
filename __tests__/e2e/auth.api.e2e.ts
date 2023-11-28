import request from "supertest";
import {RouterPath} from "../../src/routerPaths";
import {AddUserParams} from "../../src/types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
import {usersQueryRepository} from "../../src/repositories/users/users-query-repo";
import {runDb} from "../../src/repositories/db";

const app = initApp();

// const loginSeveraUsers = (count: number) => {
//     let users = []
//     for (let i = 0; i<count; i++) {
//         //const res = await login()
//         users.push
//     }

//     return usrs
// }

jest.mock('../../src/managers/email-manager', () => ({
    emailManager: {
        sendUserRegistrationMail: jest.fn().mockResolvedValue(true),
    },
}));

describe('tests for /auth registration', () => {
    let tokens = []
    let newUser: any
    let oldRefreshToken: string
    let server: any

    beforeAll(async () => {
        //tokens = await loginSomeUsers()
        await runDb();
        const app = initApp();
        const PORT = process.env.PORT || 3000;
        server = app.listen(PORT, () => {
            console.log(`Test server running on port ${PORT}`);
        });

        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
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

        expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Invalid email format'
                })
            ])
        );
    })

    it('should register a new user successfully', async () => {
       const userData = {
            login: "JohnDoe",
            password: "password123",
            email: "artur0_g@proton.me"
        }
        const response = await request(app)
            .post(`${RouterPath.auth}/registration`)
            .send(userData)

        expect(response.statusCode).toBe(HTTP_STATUS.NO_CONTENT)

        newUser = await usersQueryRepository.getUserByLogin(userData.login)
    })

    it ('should fail registration when sending invalid registration code', async () => {
        const invalidConfirmationCode = '12345'

        const response = await request(app)
            .post(`${RouterPath.auth}/registration-confirmation`)
            .send({code: invalidConfirmationCode})

        expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it ('should confirm the user registration', async () => {

        const confirmationCode = newUser.emailConfirmation.confirmationCode
        const response = await request(app)
            .post(`${RouterPath.auth}/registration-confirmation`)
            .send({code: confirmationCode})

        expect(response.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
    })

    it('should login user successfully', async () => {
        const credentials = {
            loginOrEmail: newUser.accountData.login,
            password: "password123"
        };

        const response = await request(app)
            .post(`${RouterPath.auth}/login`)
            .send(credentials);

        expect(response.statusCode).toBe(HTTP_STATUS.OK)
        expect(response.text).toBeDefined()

        const refreshTokenCookie = response.headers['set-cookie']
            .some((cookie: string) => cookie.startsWith('refreshToken=')) //return bull for test

        const refreshTokenHeader = response.headers['set-cookie'].find((cookie: string) => cookie.startsWith('refreshToken='))
        oldRefreshToken = refreshTokenHeader.split(';')[0].split('=')[1]  // get token

        expect(refreshTokenCookie).toBeTruthy()
    })

    it('should refresh the token successfully', async () => {

        const response = await request(app)
            .post(`${RouterPath.auth}/refresh-token`)
            .set('Cookie', `refreshToken=${oldRefreshToken}`)
            .send();

        expect(response.statusCode).toBe(HTTP_STATUS.OK);
        expect(response.text).toBeDefined(); // Check for new access token in response body
        const refreshTokenCookie = response.headers['set-cookie']
            .some((cookie: string) => cookie.startsWith('refreshToken='));
        expect(refreshTokenCookie).toBeTruthy()
    })

    it ('should logout the user', async () => {
        const response = await request(app)
            .post(`${RouterPath.auth}/logout`)
            .set('Cookie', `refreshToken=${oldRefreshToken}`)
            .send()

        expect(response.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
    })
    afterAll(done => {
        server.close(() => {
            console.log('Test server stopped');
            done();
        });
    });
})

