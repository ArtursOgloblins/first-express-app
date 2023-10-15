import request from "supertest";
import {app} from "../../index";
import {RouterPath} from "../../routerPaths";
import {HttpStatusCodes as HTTP_STATUS, HttpStatusType} from "../../helpers/httpStatusCodes";
import {AddBlogAttr} from "../../types";

const base64Credentials = Buffer.from('admin:qwerty').toString('base64');

export const blogsTestManager = {

    async createBlog(data: AddBlogAttr, expectedStatusCode: HttpStatusType = HTTP_STATUS.CREATED) {

        const response = await request(app)
            .post (RouterPath.blogs)
            // TODO: `Check on support auth approach`
            .set('Authorization', `Basic ${base64Credentials}`)
            .send (data)
            .expect(expectedStatusCode)

        let createdEntity;

        if (expectedStatusCode == HTTP_STATUS.CREATED) {
            createdEntity = response.body
            expect(createdEntity).toEqual({
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

    async returnEmptyArray() {
        return request(app)
            .get(RouterPath.blogs)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            });
    }
}