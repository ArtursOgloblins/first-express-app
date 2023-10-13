import request from 'supertest'
import {app} from '../index'
import {RouterPath} from "../routerPaths";
import { HttpStatusCodes as HTTP_STATUS }  from "../helpers/httpStatusCodes";


describe('tests for /blogs', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64');

    beforeAll(async () => {
        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
    })

    it('should return 200 and empty array', async()=> {
        await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })

    let createdEntity: any = null
    it ('create entity with correct input data', async () => {
        const createEntity = await request(app)
            .post (RouterPath.blogs)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                name: "New Blog5",
                description: "description",
                websiteUrl: "https://youtube.com/"
            })
            .expect(HTTP_STATUS.CREATED)

        createdEntity = createEntity.body

        expect(createdEntity).toEqual({
            id: expect.any(String),
            name: "New Blog5",
            description: "description",
            websiteUrl: "https://youtube.com/",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })

        await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [createdEntity]
            })
    })

    it ('create entity with incorrect input data', async () => {
        await request(app)
            .post (RouterPath.blogs)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                name: "New Blog5",
                description: "description",
                websiteUrl: "whttps://youtube.com/" // incorrect
            })
            .expect(HTTP_STATUS.BAD_REQUEST)
    })
})

