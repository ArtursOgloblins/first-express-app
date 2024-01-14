import request from "supertest";
import {RouterPath} from "../../src/routerPaths";
import {HttpStatusCodes as HTTP_STATUS, HttpStatusType} from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
const app = initApp();

export const commentsTestManager = {
    async createComment(authToken: any, postId: any, expectedStatusCode: HttpStatusType = HTTP_STATUS.CREATED) {

        const data = {
            content: "New comment with more then 20 characters.",
        }

        const response = await request(app)
            .post(`${RouterPath.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity = null

        if (expectedStatusCode === HTTP_STATUS.CREATED) {
            createdEntity = response.body
            expect(createdEntity).toMatchObject({
                content: "New comment with more then 20 characters.",
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: expect.any(String)
                },
                createdAt: expect.any(String),
                postId: postId,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            })
        }

        return {response , createdEntity}
    },

    async verifyCommentListContains(comment: any) {
         const response = await request(app)
             .get(`${RouterPath.comments}/${comment._id}`)
             .expect(HTTP_STATUS.OK)
    }
}