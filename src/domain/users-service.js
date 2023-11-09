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
exports.userService = void 0;
const bcrypt_1 = require("bcrypt");
const users_db_repo_1 = require("../repositories/users/users-db-repo");
exports.userService = {
    createUser(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = inputData;
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const createdAt = new Date().toISOString();
            const newUser = {
                login: login,
                email: email,
                password: passwordHash,
                passwordSalt: passwordSalt,
                createdAt: createdAt
            };
            return users_db_repo_1.usersRepository.createUser(newUser);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repo_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user)
                return null;
            const passwordHash = yield this._generateHash(password, user.passwordSalt);
            if (user.password == passwordHash) {
                return user;
            }
            return null;
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    },
};
