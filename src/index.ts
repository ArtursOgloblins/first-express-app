import express, {Express, Request, Response} from 'express'
import bodyParser from "body-parser";
import videoRoutes from './routes/videoRoutes'

const app: Express = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser())

app.use(bodyParser.json())
app.use('/videos', videoRoutes)
app.delete('/testing/all-data',(req: Request, res: Response) => {
    videos.length = 0
    res.send(204)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
