import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 3000;

interface VideoInput {
    title: string;
    author: string;
    availableResolutions: string[];
}

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

app.delete('/testing/all-data',(req: Request, res: Response) => {
    videos.length = 0
    res.sendStatus(204)
})

app.post('/videos', (req: Request, res: Response) => {

    const validation = validateInput(req.body);

    if (!validation.isValid) {
        return res.status(400).send({
            errorMessages: validation.errors
        });
    }

    const today = new Date();
    const createdAt = today.toISOString()
    today.setDate(today.getDate() + 1);
    const publicationDate = today.toISOString();

    const newVideo = {

        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: createdAt,
        publicationDate: publicationDate,
        availableResolutions: req.body.availableResolutions
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})


app.put('/videos/:id', (req: Request, res: Response) => {

    const validation = validateInput(req.body);

    if (!validation.isValid) {
        return res.status(400).send({
            errorMessages: validation.errors
        });
    }

    let video = videos.find(p => p.id === +req.params.id)
    if (video){
        video.title = req.body.title
        video.author = req.body.author
        video.canBeDownloaded = req.body.canBeDownloaded
        video.minAgeRestriction = req.body.minAgeRestriction
        video.createdAt = (new Date()).toISOString()
        video.publicationDate = (new Date().toISOString())
        video.availableResolutions = req.body.availableResolutions

        res.send(video)
    } else {
        res.send(404)
    }
})
const a = (a: any) => {
    const errors: {field: string, message: string}[] = []
    //validate a ??? errors.push({})
    return errors.length ? errors : null
}

const b = (b: any) => {

    const errors: {field: string, message: string}[] = []
    const aErr = a({})
    if(aErr){
        for (const aErrElement of aErr) {
            errors.push(aErrElement)
        }
    }
    //validate b ??? errors.push({})
    return errors.length ? errors : null
}

const validateInput = (input: any): { isValid: boolean, errors: Array<{ message: string, field: string }> } => {
    const errors = []

    if (!input.title || typeof input.title !== 'string' || !input.title.trim() || input.title.length > 40) errors.push({ field: 'title', message: 'Title is required and must be a string' });
    if (typeof input.author !== 'string') errors.push({ field: 'author', message: 'Author is required and must be a string' });

    return {
        isValid: errors.length === 0,
        errors
    };
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
