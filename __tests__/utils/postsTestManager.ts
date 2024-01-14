import request from "supertest";
import {RouterPath} from "../../src/routerPaths";
import {HttpStatusCodes as HTTP_STATUS, HttpStatusType} from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
import {AddPostAttr} from "../../src/types/types";
import {Post} from "../../src/domain/Posts";
const app = initApp();

const base64Credentials = Buffer.from('admin:qwerty').toString('base64');

export const postsTestManager = {

    async createPost(blogId: any, blogName: string, expectedStatusCode: HttpStatusType = HTTP_STATUS.CREATED) {

        const data: AddPostAttr =  {
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: blogId
        }

        const response = await request(app)
            .post (RouterPath.posts)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send (data)
            .expect(expectedStatusCode)

        let createdEntity = null

        if (expectedStatusCode == HTTP_STATUS.CREATED) {
            createdEntity = response.body
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: "New Post4",
                shortDescription: "Some description",
                content: "Content",
                blogId: blogId,
                blogName: blogName,
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    dislikesCount: 0,
                    likesCount: 0,
                    myStatus: "None",
                    newestLikes: [],
                }
            })
        }
        return {response , createdEntity}
    },

    async returnEmptyArray() {
        return request(app)
            .get(RouterPath.posts)
            .expect(HTTP_STATUS.OK, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    },

    async verifyPostListContains(post: Post) {
        const response = await request(app)
            .get(RouterPath.posts)
            .expect(HTTP_STATUS.OK)

        expect(response.body.items).toContainEqual(post);
    }
}