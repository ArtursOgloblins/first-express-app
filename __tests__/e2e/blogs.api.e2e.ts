import request from 'supertest'
import mongoose from 'mongoose';
import {RouterPath} from "../../src/routerPaths";
import { HttpStatusCodes as HTTP_STATUS }  from "../../src/helpers/httpStatusCodes";

import {initApp} from "../../src/initApp";
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
const app = initApp();

describe('tests for /blogs', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64')
    const mongoURI = 'mongodb://0.0.0.0:27017/test_db'

    beforeAll(async () => {
        try {
            await mongoose.connect(mongoURI);
            console.log("MongoDB successfully connected");
            await request(app).delete(`${RouterPath.testing}/all-data`);
        } catch (error) {
            console.error("Setup error: ", error)
            throw error
        }
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it('should return 200 and empty array', async()=> {
        await  blogsTestManager.expectEmptyBlogList()
    })

    let newBlog: any = null
    it ('create entity with correct input data', async () => {
        const {createdEntity} = await blogsTestManager.createBlog(HTTP_STATUS.CREATED)

        newBlog = createdEntity

        await blogsTestManager.verifyBlogListContains(newBlog)
    })

    it ('create entity with incorrect input data', async () => {

        await blogsTestManager.createBlogAndExpectFailure()
    })

    it ('update entity with correct input data', async () => {
        await request(app)
            .put (`${RouterPath.blogs}/${newBlog.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                name: "Updated",
                description: "updated blog",
                websiteUrl: "https://mongodb.com"
            })
            .expect(HTTP_STATUS.NO_CONTENT)

            expect({...newBlog,
                    "pagesCount": 1,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 1,
                    "items": [{
                        id: expect.any(String),
                        name: "Updated",
                        description: "updated blog",
                        websiteUrl: "https://mongodb.com",
                        createdAt: expect.any(String),
                        isMembership: expect.any(Boolean)
                    }]
                })
    })

    it ('update video with incorrect input data', async () => {
        await request(app)
            .put (`${RouterPath.blogs}/${newBlog.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                "name": "Updated",
                "description": "desc3",
                "websiteUrl": "whttps://mongodb.com" // incorrect
            })
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it ('update entity with incorrect input data', async () => {
        await request(app)
            .put (`${RouterPath.blogs}/${newBlog.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                "name": "Updated",
                "description": "desc3",
                "websiteUrl": "whttps://mongodb.com" // incorrect
            })
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it ('update entity with incorrect ID', async () => {
        await request(app)
            .put (`${RouterPath.blogs}/000000000000000000000000`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                "name": "Updated",
                "description": "desc3",
                "websiteUrl": "https://mongodb.com" // incorrect
            })
            .expect(HTTP_STATUS.NOT_FOUND
            )
    })

    it ('delete one entity by ID', async () =>{
        await request(app)
            .delete(`${RouterPath.blogs}/${newBlog.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(HTTP_STATUS.NO_CONTENT)
    })

    it('should return 200 and empty array', async()=> {
        await  blogsTestManager.expectEmptyBlogList()
    })
})

