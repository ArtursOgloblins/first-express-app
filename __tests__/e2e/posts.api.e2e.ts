import request from 'supertest'
import mongoose from 'mongoose';
import {RouterPath} from "../../src/routerPaths";
import {HttpStatusCodes as HTTP_STATUS} from "../../src/helpers/httpStatusCodes";
import {AddPostAttr} from "../../src/types/types";
import {initApp} from "../../src/initApp";
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
// @ts-ignore
import {postsTestManager} from "../utils/postsTestManager";
const app = initApp();


describe('tests for /blogs', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64')
    const mongoURI = 'mongodb://0.0.0.0:27017/test_db'

    beforeAll(async () => {
        await mongoose.connect(mongoURI)
            .then(() => console.log("MongoDB successfully connected"))
            .catch(err => console.error("MongoDB connection error: ", err))

        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it('should return 200 and empty array', async () => {
        await  blogsTestManager.expectEmptyBlogList()
    })

    let newBlog: any = null
    it ('create entity with correct input data', async () => {
        const {createdEntity} = await blogsTestManager.createBlog(HTTP_STATUS.CREATED)

        newBlog = createdEntity

        await blogsTestManager.verifyBlogListContains(newBlog)
    })

    let newEntity: any = null
    it ('create entity with correct input data', async () => {
        const {createdEntity} = await postsTestManager.createPost(newBlog.id, newBlog.name, HTTP_STATUS.CREATED)

        newEntity = createdEntity

        await postsTestManager.verifyPostListContains(newEntity)
    })

    it ('create entity with incorrect input data', async () => {

        const data: AddPostAttr =  {
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: "000000000000000000000000"
        }

        await request(app)
            .post(RouterPath.posts)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(data)
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it ('create entity with incorrect input data', async () => {
        await blogsTestManager.createBlogAndExpectFailure()
    })

    it ('update entity with correct input data', async () => {
        await request(app)
            .put (`${RouterPath.posts}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                title: "updated",
                shortDescription: "Some description",
                content: "Updated content",
                blogId: newBlog.id
            })
            .expect(HTTP_STATUS.NO_CONTENT)

        expect({...newEntity,
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [{
                id: expect.any(String),
                title: "updated",
                shortDescription: "Some description",
                content: "Updated content",
                blogId: newBlog.id,
                blogName: "New Blog5",
                createdAt: expect.any(String)
            }]
        })
    })

    it ('update entity with incorrect input data', async () => {
        await request(app)
            .put (`${RouterPath.posts}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                title: "updated",
                shortDescription: "Some description",
                content: "Updated content",
                blogId: "000000000000000000000000"
            })
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it ('update entity with incorrect input data', async () => {
        await request(app)
            .put (`${RouterPath.posts}/000000000000000000000000`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send ({
                title: "updated",
                shortDescription: "Some description",
                content: "Updated content",
                blogId: newBlog.id
            })
            .expect(HTTP_STATUS.NOT_FOUND)
    })

    it ('delete one entity by ID', async () =>{
        await request(app)
            .delete(`${RouterPath.posts}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(HTTP_STATUS.NO_CONTENT)
    })

    it ('delete one entity by ID', async () =>{
        await request(app)
            .delete(`${RouterPath.blogs}/${newBlog.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(HTTP_STATUS.NO_CONTENT)
    })

    it('should return 200 and empty array', async()=> {
        await postsTestManager.returnEmptyArray()
    })

    it('should return 200 and empty array', async()=> {
        await  blogsTestManager.expectEmptyBlogList()
    })
})