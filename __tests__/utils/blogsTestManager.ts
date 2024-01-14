import request from "supertest";
import {RouterPath} from "../../src/routerPaths";
import {HttpStatusCodes as HTTP_STATUS, HttpStatusType} from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
import {Blog} from "../../src/domain/Blogs";
const app = initApp();

const base64Credentials = Buffer.from('admin:qwerty').toString('base64');

export const blogsTestManager = {


    async createBlog(expectedStatusCode: HttpStatusType = HTTP_STATUS.CREATED) {

        const blogData = {
            name: "New Blog5",
                description: "description",
                websiteUrl: "https://youtube.com/"
        }

        const response = await request(app)
            .post (RouterPath.blogs)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send (blogData)
            .expect(expectedStatusCode)

        let createdEntity = null

        if (expectedStatusCode == HTTP_STATUS.CREATED) {
            createdEntity = response.body
            expect(createdEntity).toMatchObject({
                id: expect.any(String),
                name: "New Blog5",
                description: "description",
                websiteUrl: "https://youtube.com/",
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
        }

        return {response , createdEntity}
    },

    async expectEmptyBlogList() {
        return request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    },

    async verifyBlogListContains(blog: Blog) {
        const response = await request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK);

        expect(response.body.items).toContainEqual(blog);
    },

    async createBlogAndExpectFailure() {
        const invalidBlogData = {
            name: "Invalid Blog",
            description: "This blog has an invalid URL",
            websiteUrl: "https://youtube" // Invalid URL format
        };

        const response = await request(app)
            .post(RouterPath.blogs)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(invalidBlogData)
            .expect(HTTP_STATUS.BAD_REQUEST)

        expect(response.body).toMatchObject({
            errorsMessages: [
                {
                    message: "Max length 10",
                    "field": "name"
                },
                {
                    message: "Invalid URL format",
                    field: "websiteUrl"
                }
            ]
        })
    }
}