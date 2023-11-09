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
const basicAuth_1 = require("../middleware/auth/basicAuth");
const postsInputValidation_1 = require("../middleware/posts/postsInputValidation");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repo_1 = require("../repositories/posts/posts-query-repo");
const httpStatusCodes_1 = require("../helpers/httpStatusCodes");
const comments_service_1 = require("../domain/comments-service");
const commentInputValidation_1 = require("../middleware/comments/commentInputValidation");
const authWithToken_1 = require("../middleware/auth/authWithToken");
const postRouter = express_1.default.Router();
postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const sortBy = ((_a = req.query.sortBy) === null || _a === void 0 ? void 0 : _a.toString()) || 'createdAt';
    const sortDirection = ((_b = req.query.sortDirection) === null || _b === void 0 ? void 0 : _b.toString().toLowerCase()) === 'asc' ? 'asc' : 'desc';
    const getPostsParams = {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    };
    const posts = yield posts_query_repo_1.postsQueryRepository.getPosts(getPostsParams);
    res.send(posts);
}));
postRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_query_repo_1.postsQueryRepository.getPostById(req.params.id);
    if (post) {
        res.send(post);
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
postRouter.post('/', basicAuth_1.basicAuth, (0, postsInputValidation_1.CreatePostValidation)(true), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_service_1.postService.createPost(req.body);
    if (!newPost) {
        res.status(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    else {
        res.status(httpStatusCodes_1.HttpStatusCodes.CREATED).send(newPost);
    }
}));
postRouter.put('/:id', basicAuth_1.basicAuth, (0, postsInputValidation_1.UpdatePostValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedPost = yield posts_service_1.postService.updatePost(Object.assign({ id }, req.body));
    if (updatedPost) {
        res.status(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT).send(updatedPost);
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
postRouter.delete('/:id', basicAuth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_query_repo_1.postsQueryRepository.deletePostById(req.params.id);
    if (isDeleted) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
postRouter.post('/:postId/comments', authWithToken_1.authWithToken, commentInputValidation_1.commentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const post = yield posts_query_repo_1.postsQueryRepository.getPostById(postId);
    if (!post)
        return res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    const newComment = comments_service_1.commentsService.createComment({ content: req.body.comment, userId: req.user._id });
    if (!newComment) {
        res.status(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    else {
        res.status(httpStatusCodes_1.HttpStatusCodes.CREATED).send(newComment);
    }
}));
exports.default = postRouter;
