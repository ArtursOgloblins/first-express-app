import request from 'supertest'
import mongoose from 'mongoose';
import {RouterPath} from "../../src/routerPaths";
import { HttpStatusCodes as HTTP_STATUS }  from "../../src/helpers/httpStatusCodes";
import {AddBlogAttr, AddPostAttr, AddPostByBlogIdtAttr} from "../../src/types/types";
import {initApp} from "../../src/initApp";
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
const app = initApp();



describe('tests for /blogs/posts', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64')
    const mongoURI = 'mongodb://0.0.0.0:27017/test_db'

    beforeAll(async () => {
        await mongoose.connect(mongoURI)
            .then(() => console.log("MongoDB successfully connected"))
            .catch(err => console.error("MongoDB connection error: ", err))

        await request(app).delete(`${RouterPath.testing}/all-data`)
            .catch(err => console.error(err.message))
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    let newBlog: any = null
    it ('create entity with correct input data', async () => {
        const data: AddBlogAttr =  {
            name: "New Blog5",
            description: "description",
            websiteUrl: "https://youtube.com/"
        }
        const {createdEntity} = await blogsTestManager.createBlog(data)

        newBlog = createdEntity

        await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [newBlog]
            })
    })

    let newPost: any = null
    it ('create entity with correct input data', async () => {

        const data: AddPostAttr =  {
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id
        }

        const response = await request(app)
            .post(RouterPath.posts)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(data)
            .expect(HTTP_STATUS.CREATED)

        newPost = response.body;

        expect(newPost).toEqual({
            id: expect.any(String),
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: "None",
                newestLikes: [],
            }
        })
    })

    it('Get post by blog id', async  () => {
        return request(app)
            .get(`${RouterPath.blogs}/${newBlog.id}/posts`)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [newPost]
            });
    })

    let newPostByBlogId: any = null
    it ('Add post by blog id', async () => {
        const data: AddPostByBlogIdtAttr =  {
            title: "New post by blog id",
            shortDescription: "Some description",
            content: "Content"
        }
        const response = await request(app)
            .post(`${RouterPath.blogs}/${newBlog.id}/posts`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(data)
            .expect(HTTP_STATUS.CREATED)

        newPostByBlogId = response.body

        expect(newPostByBlogId).toEqual({
            id: expect.any(String),
            title: "New post by blog id",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: "None",
                newestLikes: [],
            }
        })
    })
})