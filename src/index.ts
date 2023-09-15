import express, {Express, Request, Response} from 'express'
import bodyParser from "body-parser";
import videoRoutes from './routes/videoRoutes'
import testRoutes from "./routes/testRoutes";

const app: Express = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser())

app.use(bodyParser.json())
app.use('/videos', videoRoutes)
app.use('/testing', testRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
