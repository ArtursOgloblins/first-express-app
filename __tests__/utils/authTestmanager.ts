import request from "supertest";
import {RouterPath} from "../../src/routerPaths";
import {initApp} from "../../src/initApp";

const app = initApp()

export const authTestManager = {

     userOneData : {
        login: "JohnDoe",
        password: "password123",
        email: "artur0_g@proton.me"
    },

     userTwoData : {
        login: "JaneDoe",
        password: "password123",
        email: "jane@doe.com"
    },


    credentialsUserOne : {
        loginOrEmail: "JohnDoe",
        password: "password123"
    },

    credentialsUserTwo :{
        loginOrEmail: "JaneDoe",
        password: "password123"
    },

    async registerUser(userData: any) {
        return request(app)
            .post(`${RouterPath.auth}/registration`)
            .send(userData)
    },


        async  confirmRegistration(confirmationCode: string) {
        return request(app)
            .post(`${RouterPath.auth}/registration-confirmation`)
            .send({code: confirmationCode})
    },

    async loginUser(credentials: any) {
        const response = await request(app)
            .post(`${RouterPath.auth}/login`)
            .send(credentials)

        return response.body.accessToken
    }
}