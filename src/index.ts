import express, {Express} from 'express'
import bodyParser from "body-parser";
import videoRoutes from './routes/videoRoutes'
import testRoutes from "./routes/testRoutes";

export const app: Express = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(bodyParser.json())
app.use('/videos', videoRoutes)
app.use('/testing', testRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
