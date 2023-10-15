import request from 'supertest'
import {app} from '../../index'
import {RouterPath} from "../../routerPaths";
import { HttpStatusCodes as HTTP_STATUS }  from "../../helpers/httpStatusCodes";
import {AddBlogAttr, AddPostAttr, AddPostByBlogIdtAttr} from "../../types";
import {blogsTestManager} from "../utils/blogsTestManager";


describe('tests for /blogs/posts', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64');

    beforeAll(async () => {
        await request(app).delete(`${RouterPath.testing}/all-data`)
            .catch(err => console.error(err.message))
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
            createdAt: expect.any(String)
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
            createdAt: expect.any(String)
        })
    })
})