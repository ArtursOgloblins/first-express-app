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
exports.usersRepository = void 0;
const db_1 = require("../db");
const mappers_1 = require("../../helpers/mappers");
const dbName = process.env.DB_NAME || "blogs_posts";
const db = db_1.client.db(dbName);
const usersCollection = db.collection("users");
exports.usersRepository = {
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield usersCollection.insertOne(newUser);
            return (0, mappers_1.userMapper)(Object.assign(Object.assign({}, newUser), { _id: res.insertedId }));
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        });
    }
};
