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
exports.authWithToken = void 0;
const httpStatusCodes_1 = require("../../helpers/httpStatusCodes");
const jwt_service_1 = require("../../application/jwt-service");
const users_query_repo_1 = require("../../repositories/users/users-query-repo");
const authWithToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = yield users_query_repo_1.usersQueryRepository.findUserById(userId);
        return next();
    }
    res.sendStatus(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
});
exports.authWithToken = authWithToken;
