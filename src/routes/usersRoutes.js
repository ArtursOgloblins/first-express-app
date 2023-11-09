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
const httpStatusCodes_1 = require("../helpers/httpStatusCodes");
const users_service_1 = require("../domain/users-service");
const createUserValidation_1 = require("../middleware/users/createUserValidation");
const query_params_1 = require("../helpers/query-params");
const users_query_repo_1 = require("../repositories/users/users-query-repo");
const basicAuth_1 = require("../middleware/auth/basicAuth");
const usersRouter = express_1.default.Router();
usersRouter.get('/', basicAuth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { sortBy, sortDirection, pageSize, pageNumber } = (0, query_params_1.getQueryParams)(req);
    const searchLoginTerm = ((_a = req.query.searchLoginTerm) === null || _a === void 0 ? void 0 : _a.toString()) || null;
    const searchEmailTerm = ((_b = req.query.searchEmailTerm) === null || _b === void 0 ? void 0 : _b.toString()) || null;
    const getUserParams = {
        searchLoginTerm,
        searchEmailTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    };
    const users = yield users_query_repo_1.usersQueryRepository.getUsers(getUserParams);
    res.send(users);
}));
usersRouter.post('/', basicAuth_1.basicAuth, (0, createUserValidation_1.createUserValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const newUser = yield users_service_1.userService.createUser({ login, password, email });
    res.status(httpStatusCodes_1.HttpStatusCodes.CREATED).send(newUser);
}));
usersRouter.delete('/:id', basicAuth_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield users_query_repo_1.usersQueryRepository.removeUserById(req.params.id);
    if (isDeleted) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NO_CONTENT);
    }
    else {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
}));
exports.default = usersRouter;
