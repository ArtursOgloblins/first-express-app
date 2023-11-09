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
const blogs_service_1 = require("../domain/blogs-service");
const blogInputValidations_1 = require("../middleware/blogs/blogInputValidations");
const inputValidationResult_1 = require("../middleware/inputValidationResult");
const basicAuth_1 = require("../middleware/auth/basicAuth");
const blogs_query_repo_1 = require("../repositories/blogs/blogs-query-repo");
const postsInputValidation_1 = require("../middleware/posts/postsInputValidation");
const posts_service_1 = require("../domain/posts-service");
const query_params_1 = require("../helpers/query-params");
const httpStatusCodes_1 = require("../helpers/httpStatusCodes");
const blogRouter = express_1.default.Router();
blogRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sortBy, sortDirection, pageSize, pageNumber } = (0, query_params_1.getQueryParams)(req);
    const searchNameTerm = ((_a = req.query.searchNameTerm) === null || _a === void 0 ? void 0 : _a.toString()) || null;
    const getBlogParams = {
        searchNameTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    };
    const blogs = yield blogs_query_repo_1.blogsQueryRepository.getBlogs(getBlogParams);
    res.send(blogs);
}));
blogRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repo_1.blogsQueryRepository.getBlogById(req.params.id);
    if (blog) {
        res.send(blog);
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
blogRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const blog = yield blogs_query_repo_1.blogsQueryRepository.getBlogById(blogId);
    if (!blog)
        return res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    const { sortBy, sortDirection, pageSize, pageNumber } = (0, query_params_1.getQueryParams)(req);
    const getPostsParams = {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    };
    const posts = yield blogs_query_repo_1.blogsQueryRepository.getPostsByBlogId(blogId, getPostsParams);
    res.send(posts);
}));
blogRouter.post('/', basicAuth_1.basicAuth, blogInputValidations_1.blogValidationPost, inputValidationResult_1.InputValidationResult, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const newBlogId = yield blogs_service_1.blogsService.addBlog({ name, description, websiteUrl });
    const newBlog = yield blogs_query_repo_1.blogsQueryRepository.getBlogById(newBlogId);
    res.status(httpStatusCodes_1.HttpStatusCodes.CREATED).send(newBlog);
}));
blogRouter.post('/:id/posts', basicAuth_1.basicAuth, (0, postsInputValidation_1.CreatePostValidation)(false), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const newPost = yield posts_service_1.postService.createPost(Object.assign({ blogId }, req.body));
    if (!newPost) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
    else {
        res.status(httpStatusCodes_1.HttpStatusCodes.CREATED).send(newPost);
    }
}));
blogRouter.put('/:id', basicAuth_1.basicAuth, blogInputValidations_1.blogValidationPost, inputValidationResult_1.InputValidationResult, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;
    const updatedBlog = yield blogs_service_1.blogsService.updateBlog({ id, name, description, websiteUrl });
    if (updatedBlog) {
        res.status(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT).send();
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
blogRouter.delete('/:id', basicAuth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_query_repo_1.blogsQueryRepository.removeBlogById(req.params.id);
    if (isDeleted) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
exports.default = blogRouter;
