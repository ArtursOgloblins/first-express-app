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
exports.postsTestManager = void 0;
const supertest_1 = require("supertest");
const index_1 = require("../../index");
const routerPaths_1 = require("../../routerPaths");
const httpStatusCodes_1 = require("../../helpers/httpStatusCodes");
const base64Credentials = Buffer.from('admin:qwerty').toString('base64');
exports.postsTestManager = {
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
    returnEmptyArray() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, supertest_1.default)(index_1.app)
                .get(routerPaths_1.RouterPath.posts)
                .expect(httpStatusCodes_1.HttpStatusCodes.OK, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            });
        });
    }
};
