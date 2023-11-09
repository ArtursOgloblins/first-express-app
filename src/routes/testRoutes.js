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
const express_1 = require("express");
const testRepository_1 = require("../repositories/testRepository");
const httpStatusCodes_1 = require("../helpers/httpStatusCodes");
const testRouter = express_1.default.Router();
testRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //testRepository.deleteAllVideos()
    yield testRepository_1.testRepository.deleteAllBlogs();
    yield testRepository_1.testRepository.deleteAllPosts();
    yield testRepository_1.testRepository.deleteAllUsers();
    res.status(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT).send();
}));
exports.default = testRouter;
