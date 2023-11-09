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
exports.usersQueryRepository = void 0;
const db_1 = require("../db");
const query_params_1 = require("../../helpers/query-params");
const mappers_1 = require("../../helpers/mappers");
const mongodb_1 = require("mongodb");
const dbName = process.env.DB_NAME || "blogs_posts";
const db = db_1.client.db(dbName);
const usersCollection = db.collection("users");
exports.usersQueryRepository = {
    getUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            let filterConditions = [];
            if (params.searchLoginTerm) {
                filterConditions.push({ login: new RegExp(params.searchLoginTerm, "i") });
            }
            if (params.searchEmailTerm) {
                filterConditions.push({ email: new RegExp(params.searchEmailTerm, "i") });
            }
            if (filterConditions.length) {
                filter.$or = filterConditions;
            }
            const { skipAmount, sortDir } = (0, query_params_1.getPaginationDetails)(params);
            const totalCount = yield usersCollection.countDocuments(filter);
            const users = yield usersCollection
                .find(filter)
                .sort({ [params.sortBy]: sortDir })
                .skip(skipAmount)
                .limit(params.pageSize)
                .toArray();
            const sanitizedUsers = users.map((u) => (0, mappers_1.userMapper)(u));
            return {
                pagesCount: Math.ceil(totalCount / params.pageSize),
                page: params.pageNumber,
                pageSize: params.pageSize,
                totalCount: totalCount,
                items: sanitizedUsers
            };
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            const user = yield usersCollection.findOne({ _id: id });
            if (!user) {
                return null;
            }
            return user;
        });
    },
    removeUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    }
};
