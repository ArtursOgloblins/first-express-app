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
exports.app = void 0;
const express_1 = require("express");
const body_parser_1 = require("body-parser");
const blogsRoutes_1 = require("./routes/blogsRoutes");
const testRoutes_1 = require("./routes/testRoutes");
const postsRoutes_1 = require("./routes/postsRoutes");
const db_1 = require("./repositories/db");
const routerPaths_1 = require("./routerPaths");
const usersRoutes_1 = require("./routes/usersRoutes");
const authRouter_1 = require("./routes/authRouter");
exports.app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
exports.app.use(express_1.default.json());
exports.app.use(body_parser_1.default.json());
exports.app.use(routerPaths_1.RouterPath.blogs, blogsRoutes_1.default);
exports.app.use(routerPaths_1.RouterPath.posts, postsRoutes_1.default);
exports.app.use(routerPaths_1.RouterPath.testing, testRoutes_1.default);
exports.app.use(routerPaths_1.RouterPath.users, usersRoutes_1.default);
exports.app.use(routerPaths_1.RouterPath.auth, authRouter_1.default);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    exports.app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
startApp().catch(err => {
    console.error("Failed to start app", err);
});
