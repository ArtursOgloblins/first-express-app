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
describe('/videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).delete('/testing/all-data')
            .catch(err => console.error(err.message));
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get('/videos')
            .expect(200, []);
    }));
    it('return 404 video not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get('/videos/4214123425435')
            .expect(404);
    }));
    let createdVideo = null;
    it('create video with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const createVideo = yield (0, supertest_1.default)(index_1.app)
            .post('/videos')
            .send({
            title: "title1",
            author: "some author",
            availableResolutions: ["P144"]
        })
            .expect(201);
        createdVideo = createVideo.body;
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            minAgeRestriction: null,
            publicationDate: expect.any(String),
            canBeDownloaded: expect.any(Boolean),
            createdAt: expect.any(String),
            title: "title1",
            author: "some author",
            availableResolutions: ["P144"]
        });
        yield (0, supertest_1.default)(index_1.app)
            .get('/videos')
            .expect(200, [createdVideo]);
    }));
    it('create video with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .post('/videos')
            .send({
            "title": 123,
            "author": "some author",
            "availableResolutions": ["P144"]
        })
            .expect(400);
    }));
    it('update video with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/videos/${createdVideo.id}`)
            .send({
            title: 12345,
            author: "John Doe",
            availableResolutions: [
                "P144", "P240"
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: "2023-09-13T07:36:29.550Z"
        })
            .expect(400);
        yield (0, supertest_1.default)(index_1.app)
            .get('/videos')
            .expect(200, [createdVideo]);
    }));
    it('update video with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/videos/0000000`)
            .send({
            title: 12345,
            author: "John Doe",
            availableResolutions: [
                "P144", "P240"
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: "2023-09-13T07:36:29.550Z"
        })
            .expect(400);
    }));
    it('update video with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/videos/${createdVideo.id}`)
            .send({
            title: "Test Title",
            author: "John Doe",
            availableResolutions: [
                "P144", "P240"
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: "2023-09-13T07:36:29.550Z"
        })
            .expect(204);
        expect(Object.assign(Object.assign({}, createdVideo), { title: "Test Title", author: "John Doe", minAgeRestriction: 18, publicationDate: "2023-09-13T07:36:29.550Z", canBeDownloaded: expect.any(Boolean), createdAt: expect.any(String), availableResolutions: [
                "P144", "P240"
            ] }));
    }));
    it('delete one post', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`/videos/${createdVideo.id}`)
            .expect(204);
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get('/videos')
            .expect(200, []);
    }));
});
