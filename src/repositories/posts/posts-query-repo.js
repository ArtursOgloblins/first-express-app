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
exports.postsQueryRepository = void 0;
const mappers_1 = require("../../helpers/mappers");
const mongodb_1 = require("mongodb");
const db_1 = require("../db");
const dbName = process.env.DB_NAME || "blogs_posts";
const db = db_1.client.db(dbName);
const postCollection = db.collection("posts");
exports.postsQueryRepository = {
    getPosts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortDir = params.sortDirection === 'asc' ? 1 : -1;
            const skipAmount = (params.pageNumber - 1) * params.pageSize;
            const totalCount = yield postCollection.countDocuments();
            const posts = yield postCollection
                .find({})
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
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!post) {
                return null;
            }
            return (0, mappers_1.postMapper)(post);
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield postCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    }
};
