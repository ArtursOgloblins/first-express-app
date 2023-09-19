import request from 'supertest'
import {app} from '../index'
describe('/videos', () => {
    beforeAll( async () => {
        await request(app).delete('/testing/all-data')
            .catch(err => console.error(err.message));
    })

    it('should return 200 and empty array', async()=> {
       await request(app)
            .get('/videos')
            .expect(200, [])
    })

    it ('return 404 video not exist', async()=> {
        await request(app)
            .get('/videos/4214123425435')
            .expect(404)
    })

    let createdVideo: any = null
    it ('create video with correct input data', async () => {
        const createVideo = await request(app)
            .post ('/videos')
            .send ({
                title: "title1",
                author: "some author",
                availableResolutions: ["P144"]
            })
            .expect(201)

        createdVideo = createVideo.body

        expect(createdVideo).toEqual({
            id: expect.any(Number),
            minAgeRestriction: null,
            publicationDate: expect.any(String),
            canBeDownloaded: expect.any(Boolean),
            createdAt: expect.any(String),
            title: "title1",
            author: "some author",
            availableResolutions: ["P144"]
        })

        await request(app)
            .get('/videos')
            .expect(200, [createdVideo])
    })

    it ('create video with incorrect input data', async () => {
        await request(app)
            .post ('/videos')
            .send ({
                "title": 123,
                "author": "some author",
                "availableResolutions": ["P144"]
            })
            .expect(400)
    })

    it ('update video with incorrect input data', async () => {
        await request(app)
            .put (`/videos/${createdVideo.id}`)
            .send ({
                title: 12345,
                author: "John Doe",
                availableResolutions: [
                    "P144", "P240"
                ],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: "2023-09-13T07:36:29.550Z"
            })
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200, [createdVideo])
    })

    it ('update video with incorrect input data', async () => {
        await request(app)
            .put (`/videos/0000000`)
            .send ({
                title: 12345,
                author: "John Doe",
                availableResolutions: [
                    "P144", "P240"
                ],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: "2023-09-13T07:36:29.550Z"
            })
            .expect(400)
    })


    it ('update video with correct input data', async () => {
        await request(app)
            .put (`/videos/${createdVideo.id}`)
            .send ({
                title: "Test Title",
                author: "John Doe",
                availableResolutions: [
                    "P144", "P240"
                ],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: "2023-09-13T07:36:29.550Z"
            })
            .expect(204)

        expect({...createdVideo,
            title: "Test Title",
            author: "John Doe",
            minAgeRestriction: 18,
            publicationDate: "2023-09-13T07:36:29.550Z",
            canBeDownloaded: expect.any(Boolean),
            createdAt: expect.any(String),
            availableResolutions: [
            "P144", "P240"]
        })
    })

    it ('delete one post', async () =>{
        await request(app)
            .delete(`/videos/${createdVideo.id}`)
            .expect(204)
    })

    it('should return 200 and empty array', async()=> {
        await request(app)
            .get('/videos')
            .expect(200, [])
    })
})