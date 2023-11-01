import request from 'supertest'
import {app} from '../../index'
import {RouterPath} from "../../routerPaths";
import { HttpStatusCodes as HTTP_STATUS }  from "../../helpers/httpStatusCodes";
import {AddBlogAttr} from "../../types/types";
import {blogsTestManager} from "../utils/blogsTestManager";


describe('tests for /blogs', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64');

    beforeAll(async () => {
        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
    })

    it('should return 200 and empty array', async()=> {
        await  blogsTestManager.returnEmptyArray()
    })

    let newEntity: any = null
    it ('create entity with correct input data', async () => {
        const data: AddBlogAttr =  {
            name: "New Blog5",
            description: "description",
            websiteUrl: "https://youtube.com/"
        }
        const {createdEntity} = await blogsTestManager.createBlog(data)

        newEntity = createdEntity

        await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [newEntity]
            })
    })

    it ('create entity with incorrect input data', async () => {
        const data: AddBlogAttr =  {
            name: "New Blog5",
            description: "description",
            websiteUrl: "whttps://youtube.com/" // incorrect
        }
        await blogsTestManager.createBlog(data, HTTP_STATUS.BAD_REQUEST)
    })

    it ('update entity with correct input data', async () => {
        await request(app)
            .put (`${RouterPath.blogs}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                name: "Updated",
                description: "updated blog",
                websiteUrl: "https://mongodb.com"
            })
            .expect(HTTP_STATUS.NO_CONTENT)

            expect({...newEntity,
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
            .put (`${RouterPath.blogs}/${newEntity.id}`)
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
            .put (`${RouterPath.blogs}/${newEntity.id}`)
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
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it ('delete one entity by ID', async () =>{
        await request(app)
            .delete(`${RouterPath.blogs}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(HTTP_STATUS.NO_CONTENT)
    })

    it('should return 200 and empty array', async()=> {
        await  blogsTestManager.returnEmptyArray()
    })
})

