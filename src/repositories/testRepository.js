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
exports.testRepository = void 0;
const db_1 = require("./db");
const dbName = process.env.DB_NAME || "blogs_posts";
const db = db_1.client.db(dbName);
const postCollection = db.collection("posts");
const blogsCollection = db.collection("blogs");
const usersCollection = db.collection("users");
exports.testRepository = {
    deleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogsCollection.deleteMany({});
            return [];
        });
    },
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield postCollection.deleteMany({});
            return [];
        });
    },
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield usersCollection.deleteMany({});
            return [];
        });
    }
};
