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
exports.postService = void 0;
const posts_db_repository_1 = require("../repositories/posts/posts-db-repository");
const blogs_query_repo_1 = require("../repositories/blogs/blogs-query-repo");
exports.postService = {
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repo_1.blogsQueryRepository.getBlogById(inputData.blogId);
            if (!blog) {
                return null;
            }
            const createdAt = new Date().toISOString();
            const newPost = {
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: inputData.blogId,
                blogName: blog.name,
                createdAt: createdAt
            };
            return posts_db_repository_1.postsRepository.addPost(newPost);
        });
    },
    updatePost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.updatePost(inputData);
        });
    }
};
