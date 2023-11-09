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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db");
const mappers_1 = require("../../helpers/mappers");
const mongodb_1 = require("mongodb");
const dbName = process.env.DB_NAME || "blogs_posts";
const db = db_1.client.db(dbName);
const postCollection = db.collection("posts");
exports.postsRepository = {
    addPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield postCollection.insertOne(newPost);
            return (0, mappers_1.postMapper)(Object.assign(Object.assign({}, newPost), { _id: res.insertedId }));
        });
    },
    updatePost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = inputData, dataToUpdate = __rest(inputData, ["id"]);
            const post = yield postCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: dataToUpdate }, { returnDocument: 'after' });
            if (!post) {
                return null;
            }
            return (0, mappers_1.postMapper)(post);
        });
    }
};
