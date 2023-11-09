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
const postsTestManager_1 = require("../utils/postsTestManager");
describe('tests for /blogs', () => {
    const base64Credentials = Buffer.from('admin:qwerty').toString('base64');
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).delete(`${routerPaths_1.RouterPath.testing}/all-data`)
            //.set('Authorization', `Basic ${base64Credentials}`)
            .catch(err => console.error(err.message));
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestManager_1.blogsTestManager.returnEmptyArray();
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
    let newEntity = null;
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
        newEntity = response.body;
        expect(newEntity).toEqual({
            id: expect.any(String),
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String)
        });
    }));
    it('create entity with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: "New Post4",
            shortDescription: "Some description",
            content: "Content",
            blogId: "000000000000000000000000"
        };
        yield (0, supertest_1.default)(index_1.app)
            .post(routerPaths_1.RouterPath.posts)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send(data)
            .expect(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }));
    it('create entity with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "New Blog5",
            description: "description",
            websiteUrl: "whttps://youtube.com/" // incorrect
        };
        yield blogsTestManager_1.blogsTestManager.createBlog(data, httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }));
    it('update entity with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`${routerPaths_1.RouterPath.posts}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            title: "updated",
            shortDescription: "Some description",
            content: "Updated content",
            blogId: newBlog.id
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
        expect(Object.assign(Object.assign({}, newEntity), { "pagesCount": 1, "page": 1, "pageSize": 10, "totalCount": 1, "items": [{
                    id: expect.any(String),
                    title: "updated",
                    shortDescription: "Some description",
                    content: "Updated content",
                    blogId: newBlog.id,
                    blogName: "New Blog5",
                    createdAt: expect.any(String)
                }] }));
    }));
    it('update entity with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`${routerPaths_1.RouterPath.posts}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            title: "updated",
            shortDescription: "Some description",
            content: "Updated content",
            blogId: "000000000000000000000000"
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }));
    it('update entity with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`${routerPaths_1.RouterPath.posts}/000000000000000000000000`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            title: "updated",
            shortDescription: "Some description",
            content: "Updated content",
            blogId: newBlog.id
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }));
    it('delete one entity by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`${routerPaths_1.RouterPath.posts}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
    }));
    it('delete one entity by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`${routerPaths_1.RouterPath.blogs}/${newBlog.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield postsTestManager_1.postsTestManager.returnEmptyArray();
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestManager_1.blogsTestManager.returnEmptyArray();
    }));
});
