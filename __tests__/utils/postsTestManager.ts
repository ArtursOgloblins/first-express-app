import request from "supertest";
import {RouterPath} from "../../src/routerPaths";
import {HttpStatusCodes as HTTP_STATUS} from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
const app = initApp();

const base64Credentials = Buffer.from('admin:qwerty').toString('base64');



export const postsTestManager = {

    // async createTest(data: AddPostAttr, expectedStatusCode: HttpStatusType = HTTP_STATUS.CREATED) {
    //
    //     const response = await request(app)
    //         .post (RouterPath.posts)
    //         // TODO: `Check on support auth approach`
    //         .set('Authorization', `Basic ${base64Credentials}`)
    //         .send (data)
    //         .expect(expectedStatusCode)
    //
    //     let createdEntity;
    //
    //     if (expectedStatusCode == HTTP_STATUS.CREATED) {
    //         createdEntity = response.body
    //         expect(createdEntity).toEqual({
    //             id: expect.any(String),
    //             title: "New Post4",
    //             shortDescription: "Some description",
    //             content: "Content",
    //             blogId: "652ad71970246a059c2067df",
    //             blogName: "New Blog5",
    //             createdAt: expect.any(String)
    //         })
    //     }
    //
    //     return {response , createdEntity}
    // },

    async returnEmptyArray() {
        return request(app)
            .get(RouterPath.posts)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            });
    }
}