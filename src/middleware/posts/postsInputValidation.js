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
exports.UpdatePostValidation = exports.CreatePostValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_query_repo_1 = require("../../repositories/blogs/blogs-query-repo");
const inputValidationResult_1 = require("../inputValidationResult");
const titleValidation = (0, express_validator_1.body)('title')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Title should be string')
    .isLength({ max: 30 }).withMessage('Max length 30');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .trim()
    .exists().withMessage('Name field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Title should be string')
    .isLength({ max: 100 }).withMessage('Max length 100');
const contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Title should be string')
    .isLength({ max: 1000 }).withMessage('Max length 1000');
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Title should be string')
    .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repo_1.blogsQueryRepository.getBlogById(val);
    if (!blog)
        throw new Error('blog not found');
    return true;
}));
const CreatePostValidation = (withBlogId) => {
    const validation = [titleValidation, shortDescriptionValidation, contentValidation];
    if (withBlogId) {
        validation.push(blogIdValidation);
    }
    validation.push(inputValidationResult_1.InputValidationResult);
    return validation;
};
exports.CreatePostValidation = CreatePostValidation;
const UpdatePostValidation = () => {
    const validation = [
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        blogIdValidation
    ];
    validation.push(inputValidationResult_1.InputValidationResult);
    return validation;
};
exports.UpdatePostValidation = UpdatePostValidation;
