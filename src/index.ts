import express, {Express} from 'express'
import bodyParser from "body-parser";
import videoRoutes from './routes/videoRoutes'
import blogsRoutes from './routes/blogsRoutes'
import testRoutes from "./routes/testRoutes";
import postsRoutes from "./routes/postsRoutes";
import {runDb} from "./repositories/db";

export const app: Express = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(bodyParser.json())

app.use('/videos', videoRoutes)
app.use('/blogs', blogsRoutes)
app.use('/posts', postsRoutes)
app.use('/testing', testRoutes)


const startApp = async () => {
    await runDb()
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startApp().catch(err => {
    console.error("Failed to start app", err);
});

