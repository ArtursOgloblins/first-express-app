import express, {Express, Request, Response} from 'express'
import bodyParser from "body-parser";

const app: Express = express();

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
        "canBeDownloaded": false,
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
        "canBeDownloaded": false,
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

    const validation = validateInputPost(req.body);

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

    const validation = validateInputPut(req.body);

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
        res.send(400)
    }
})

const validateInputPost = (input: any): { isValid: boolean, errors: Array<{ message: string, field: string }> } => {
    const errors = []
    const validResolutions: string[] = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

    // Validate title
    if (input.title === undefined) {
        errors.push({ message: 'Title is required', field: 'title' });
    }
    else if (typeof input.title !== 'string') {
        errors.push({message: 'Title should be of type string',  field: 'title' });
    }
    else if (!input.title.trim()) {
        errors.push({message: 'Title should not be just whitespace', field: 'title' });
    }
    else if (input.title.length > 40) {
        errors.push({message: 'Title length should not exceed 40 characters', field: 'title' });
    }

    // Validate author
    if (input.author === undefined) {
        errors.push({message: 'Author is required', field: 'author'});
    }
    else if (typeof input.author !== 'string') {
        errors.push({message: 'Author should be of type string', field: 'author' });
    }
    else if (!input.author.trim()) {
        errors.push({message: 'Author should not be just whitespace', field: 'author'  });
    }
    else if (input.author.length > 20) {
        errors.push({message: 'Author length should not exceed 20 characters', field: 'author' });
    }

    // Validate availableResolutions
    if (!input.availableResolutions || !Array.isArray(input.availableResolutions) || input.availableResolutions.length === 0) {
        errors.push({message: 'At least one resolution should be added', field: 'availableResolutions' });
    } else {
        const uniqueValues = [...new Set(input.availableResolutions)];
        if (uniqueValues.length !== input.availableResolutions.length) {
            errors.push({message: 'Duplicate resolutions', field: 'availableResolutions' });
        }
        for (const resolution of input.availableResolutions) {
            if (!validResolutions.includes(resolution)) {
                errors.push({message: `Invalid resolution value: ${resolution}`, field: 'availableResolutions', });
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateInputPut = (input: any): { isValid: boolean, errors: Array<{ message: string, field: string }> } => {
    const firstValidation = validateInputPost(input);

    //Validate canBeDownloaded
    if (!input.canBeDownloaded) {
        firstValidation.errors.push({ field: 'canBeDownloaded', message: 'canBeDownloaded is required' });
    }
    else if (typeof input.canBeDownloaded !== 'boolean') {
        firstValidation.errors.push({ field: 'canBeDownloaded', message: 'canBeDownloaded format is wrong' });
    }

    // Validate minAgeRestriction
    if (input.minAgeRestriction === undefined) {
        firstValidation.errors.push({field: 'minAgeRestriction', message: 'minAgeRestriction is required'});
    }
    else if ( input.minAgeRestriction !== null && typeof input.minAgeRestriction !== 'number') {
        firstValidation.errors.push({ field: 'minAgeRestriction', message: 'minAgeRestriction format is wrong' });
    }
    else if (input.minAgeRestriction !== null && (input.minAgeRestriction < 1 || input.minAgeRestriction > 18)) {
        firstValidation.errors.push({ field: 'minAgeRestriction', message: 'minAgeRestriction should be between 1 and 18' });
    }

    //Validate publicationDate
    const checkPublicationDateRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    if (input.publicationDate === undefined) {
        firstValidation.errors.push({field: 'publicationDate', message: 'publicationDate is required'});
    }
    else if (typeof input.publicationDate !== 'string') {
        firstValidation.errors.push({ field: 'publicationDate', message: 'publicationDate format should be string' });
    }
    else if (!checkPublicationDateRegex.test(input.publicationDate)) {
        firstValidation.errors.push({ field: 'publicationDate', message: 'publicationDate should be in ISO format' });
    }


    firstValidation.isValid = firstValidation.errors.length === 0;
    return firstValidation;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
