import express, {Express} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {RouterPath} from "./routerPaths";
import blogsRoutes from "./routes/blogsRoutes";
import postsRoutes from "./routes/postsRoutes";
import usersRoutes from "./routes/usersRoutes";
import commentsRouter from "./routes/commentsRouter";
import testRoutes from "./routes/testRoutes";
import authRouter from "./routes/authRouter";
import securityRouter from "./routes/securityRoutes";


export const initApp = () => {
    const app: Express = express();

    app.set('trust proxy', true);

    app.use(express.json())
    app.use(bodyParser.json())
    app.use(cookieParser())


    app.use(RouterPath.blogs, blogsRoutes)
    app.use(RouterPath.posts, postsRoutes)
    app.use(RouterPath.users, usersRoutes)
    app.use(RouterPath.comments, commentsRouter)
    app.use(RouterPath.testing, testRoutes)
    app.use(RouterPath.auth, authRouter)
    app.use(RouterPath.security, securityRouter)

    return app
}

