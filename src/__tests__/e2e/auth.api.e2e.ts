import request from "supertest";
import {app} from "../../index";
import {RouterPath} from "../../routerPaths";

describe('tests for /auth', () => {
    beforeAll(async () => {
        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
    })
})