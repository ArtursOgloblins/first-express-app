import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 3000;

const videos = [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-09-12T16:19:12.783Z",
        "publicationDate": "2023-09-12T16:19:12.783Z",
        "availableResolutions": [
            "P144"
        ]
    },
    {
        "id": 1,
        "title": "Video1",
        "author": "author1",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2023-09-12T16:19:12.783Z",
        "publicationDate": "2023-09-12T16:19:12.783Z",
        "availableResolutions": [
            "P144"
        ]
    }
]
app.use(bodyParser())
app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video){
        res.send(video)
    } else {
        res.send(404)
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i=0; i<videos.length; i++){
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.send(204)
            return;
        }
    }
    res.send(404)
})

app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: (new Date()).toISOString(),
        publicationDate: (new Date().toISOString()),
        availableResolutions: req.body.availableResolutions
    }
    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
