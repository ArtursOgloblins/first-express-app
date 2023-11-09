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
    let newEntity = null;
    it('create entity with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "New Blog5",
            description: "description",
            websiteUrl: "https://youtube.com/"
        };
        const { createdEntity } = yield blogsTestManager_1.blogsTestManager.createBlog(data);
        newEntity = createdEntity;
        yield (0, supertest_1.default)(index_1.app)
            .get(routerPaths_1.RouterPath.blogs)
            .expect(httpStatusCodes_1.HttpStatusCodes.OK, {
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [newEntity]
        });
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
            .put(`${routerPaths_1.RouterPath.blogs}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            name: "Updated",
            description: "updated blog",
            websiteUrl: "https://mongodb.com"
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
        expect(Object.assign(Object.assign({}, newEntity), { "pagesCount": 1, "page": 1, "pageSize": 10, "totalCount": 1, "items": [{
                    id: expect.any(String),
                    name: "Updated",
                    description: "updated blog",
                    websiteUrl: "https://mongodb.com",
                    createdAt: expect.any(String),
                    isMembership: expect.any(Boolean)
                }] }));
    }));
    it('update video with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`${routerPaths_1.RouterPath.blogs}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            "name": "Updated",
            "description": "desc3",
            "websiteUrl": "whttps://mongodb.com" // incorrect
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }));
    it('update entity with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`${routerPaths_1.RouterPath.blogs}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            "name": "Updated",
            "description": "desc3",
            "websiteUrl": "whttps://mongodb.com" // incorrect
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }));
    it('update entity with incorrect ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`${routerPaths_1.RouterPath.blogs}/000000000000000000000000`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .send({
            "name": "Updated",
            "description": "desc3",
            "websiteUrl": "https://mongodb.com" // incorrect
        })
            .expect(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }));
    it('delete one entity by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`${routerPaths_1.RouterPath.blogs}/${newEntity.id}`)
            .set('Authorization', `Basic ${base64Credentials}`)
            .expect(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestManager_1.blogsTestManager.returnEmptyArray();
    }));
});
