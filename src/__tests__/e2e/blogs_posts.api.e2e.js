"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const index_1 = require("../../index");
const routerPaths_1 = require("../../routerPaths");
const httpStatusCodes_1 = require("../../helpers/httpStatusCodes");
const blogsTestManager_1 = require("../utils/blogsTestManager");
describe('tests for /blogs/posts', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64');
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).delete(`${routerPaths_1.RouterPath.testing}/all-data`)
            .catch(err => console.error(err.message));
    }));
    let newBlog = null;
    it('create entity with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "New Blog5",
            description: "description",
            websiteUrl: "https://youtube.com/"
        };
        const { createdEntity } = yield blogsTestManager_1.blogsTestManager.createBlog(data);
        newBlog = createdEntity;
        yield (0, supertest_1.default)(index_1.app)
            .get(routerPaths_1.RouterPath.blogs)
            .expect(httpStatusCodes_1.HttpStatusCodes.OK, {
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [newBlog]
        });
    }));
    let newPost = null;
    it('create entity with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id
        };
        const response = yield (0, supertest_1.default)(index_1.app)
            .post(routerPaths_1.RouterPath.posts)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(data)
            .expect(httpStatusCodes_1.HttpStatusCodes.CREATED);
        newPost = response.body;
        expect(newPost).toEqual({
            id: expect.any(String),
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String)
        });
    }));
    it('Get post by blog id', () => __awaiter(void 0, void 0, void 0, function* () {
        return (0, supertest_1.default)(index_1.app)
            .get(`${routerPaths_1.RouterPath.blogs}/${newBlog.id}/posts`)
            .expect(httpStatusCodes_1.HttpStatusCodes.OK, {
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [newPost]
        });
    }));
    let newPostByBlogId = null;
    it('Add post by blog id', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: "New post by blog id",
            shortDescription: "Some description",
            content: "Content"
        };
        const response = yield (0, supertest_1.default)(index_1.app)
            .post(`${routerPaths_1.RouterPath.blogs}/${newBlog.id}/posts`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(data)
            .expect(httpStatusCodes_1.HttpStatusCodes.CREATED);
        newPostByBlogId = response.body;
        expect(newPostByBlogId).toEqual({
            id: expect.any(String),
            title: "New post by blog id",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String)
        });
    }));
});
