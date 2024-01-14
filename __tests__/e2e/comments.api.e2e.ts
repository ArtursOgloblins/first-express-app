import request from 'supertest'
import mongoose from 'mongoose';
import {RouterPath} from "../../src/routerPaths";
import { HttpStatusCodes as HTTP_STATUS }  from "../../src/helpers/httpStatusCodes";
import {initApp} from "../../src/initApp";
import {UsersQueryRepository} from "../../src/infrastructure/repositories/users/users-query-repo";
// @ts-ignore
import {blogsTestManager} from "../utils/blogsTestManager";
// @ts-ignore
import {authTestManager} from "../utils/authTestmanager";
// @ts-ignore
import {postsTestManager} from "../utils/postsTestManager";
// @ts-ignore
import {commentsTestManager} from "../utils/commentTestManager";

const app = initApp();

describe('tests for blogs and posts likes', () => {
    const mongoURI = 'mongodb://0.0.0.0:27017/test_db'
    let userOne: any
    let userTwo: any
    let newBlog: any = null
    let newPost: any = null
    let newComment: any = null
    let userOneToken: any = null
    let userTwoToken: any = null

    const userOneData = authTestManager.userOneData
    const userTwoData = authTestManager.userTwoData

    const credentialsUserOne = authTestManager.credentialsUserOne
    const credentialsUserTwo = authTestManager.credentialsUserTwo

    const usersQueryRepository = new UsersQueryRepository()

    beforeAll(async () => {
        await mongoose.connect(mongoURI)
            .then(() => console.log("MongoDB successfully connected"))
            .catch(err => console.error("MongoDB connection error: ", err));

        await request(app).delete(`${RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message))
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it('register and login 2 users', async () => {
        const registerUserOne = await authTestManager.registerUser(userOneData)
        const registerUserTwo = await authTestManager.registerUser(userTwoData)

        expect(registerUserOne.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
        expect(registerUserTwo.statusCode).toBe(HTTP_STATUS.NO_CONTENT)

        userOne = await usersQueryRepository.getUserByLogin(userOneData.login)
        userTwo = await usersQueryRepository.getUserByLogin(userTwoData.login)

        const userOneConfirmationCode = userOne.emailConfirmation.confirmationCode
        const userTwoConfirmationCode = userTwo.emailConfirmation.confirmationCode

        const userOneConfirmRegistration = await authTestManager.confirmRegistration(userOneConfirmationCode)
        const userTwoConfirmRegistration = await authTestManager.confirmRegistration(userTwoConfirmationCode)

        expect(userOneConfirmRegistration.statusCode).toBe(HTTP_STATUS.NO_CONTENT)
        expect(userTwoConfirmRegistration.statusCode).toBe(HTTP_STATUS.NO_CONTENT)

        userOneToken = await authTestManager.loginUser(credentialsUserOne)
        userTwoToken = await authTestManager.loginUser(credentialsUserTwo)
        console.log('userOneToken', userOneToken)

        expect(userOneToken).toBeDefined()
        expect(userTwoToken).toBeDefined()
    })


    it ('create new Blog', async () => {
        const {createdEntity} = await blogsTestManager.createBlog(HTTP_STATUS.CREATED)

        newBlog = createdEntity

        await blogsTestManager.verifyBlogListContains(newBlog)
    })


    it ('create new Post', async () => {
        const {createdEntity} = await postsTestManager.createPost(newBlog.id, newBlog.name, HTTP_STATUS.CREATED)

        newPost = createdEntity
        console.log('newPost', newPost.id)

        await postsTestManager.verifyPostListContains(newPost)
    })

    it ('create new comment', async () => {
        const {createdEntity} = await commentsTestManager.createComment(userOneToken, newPost.id, HTTP_STATUS.CREATED)

        newComment = createdEntity
        console.log('newComment', newComment._id)

        await commentsTestManager.verifyCommentListContains(newComment)
    })
    it ('update comment', async () => {
        const response = await request(app)
            .put (`${RouterPath.comments}/${newComment._id}`)
            .set('Authorization', `Bearer ${userOneToken}`)
            .send ({
                "content": "Updated comment, Updated comment"
            })
            .expect(HTTP_STATUS.NO_CONTENT)

        // let updatedEntity = null
        //
        // updatedEntity = response.body
        // expect(updatedEntity).toMatchObject({
        //     content: "Updated comment, Updated comment",
        //     commentatorInfo: {
        //         userId: expect.any(String),
        //         userLogin: expect.any(String)
        //     },
        //     createdAt: expect.any(String),
        //     postId: newPost.id,
        //     likesInfo: {
        //         likesCount: 0,
        //         dislikesCount: 0,
        //         myStatus: "None"
        //     }
        // })
    })

    it ('get updated comment by id', async () => {
        const response = await request(app)
            .get(`${RouterPath.comments}/${newComment._id}`)
            .set('Authorization', `Bearer ${userOneToken}`)
            .expect(HTTP_STATUS.OK)

        expect(response.body).toMatchObject({
            content: "Updated comment, Updated comment",
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        })
    })

    it ('delete comment by ID', async () =>{
        await request(app)
            .delete(`${RouterPath.comments}/${newComment._id}`)
            .set('Authorization', `Bearer ${userOneToken}`)
            .expect(HTTP_STATUS.NO_CONTENT)
    })
})
