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
exports.blogsQueryRepository = void 0;
const mappers_1 = require("../../helpers/mappers");
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
const query_params_1 = require("../../helpers/query-params");
const dbName = process.env.DB_NAME || "blogs_posts";
const db = db_1.client.db(dbName);
const blogsCollection = db.collection("blogs");
const postCollection = db.collection("posts");
exports.blogsQueryRepository = {
    getBlogs(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (params.searchNameTerm) {
                filter = {
                    name: new RegExp(params.searchNameTerm, "i")
                };
            }
            const { skipAmount, sortDir } = (0, query_params_1.getPaginationDetails)(params);
            const totalCount = yield blogsCollection.countDocuments(filter);
            const blogs = yield blogsCollection
                .find(filter)
                .sort({ [params.sortBy]: sortDir })
                .skip(skipAmount)
                .limit(params.pageSize)
                .toArray();
            const mappedBlogs = blogs.map((b) => (0, mappers_1.blogMapper)(b));
            return {
                pagesCount: Math.ceil(totalCount / params.pageSize),
                page: params.pageNumber,
                pageSize: params.pageSize,
                totalCount: totalCount,
                items: mappedBlogs
            };
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            const blog = yield blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return (0, mappers_1.blogMapper)(blog);
        });
    },
    getPostsByBlogId(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skipAmount, sortDir } = (0, query_params_1.getPaginationDetails)(params);
            const filter = { blogId: id };
            const totalCount = yield postCollection.countDocuments(filter);
            const posts = yield postCollection
                .find(filter)
                .sort({ [params.sortBy]: sortDir })
                .skip(skipAmount)
                .limit(params.pageSize)
                .toArray();
            const mappedPosts = posts.map((p) => (0, mappers_1.postMapper)(p));
            return {
                pagesCount: Math.ceil(totalCount / params.pageSize),
                page: params.pageNumber,
                pageSize: params.pageSize,
                totalCount: totalCount,
                items: mappedPosts
            };
        });
    },
    removeBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    }
};
