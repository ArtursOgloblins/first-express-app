export type Video = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: string[];
};

export type DbType = {
    videos: Video[]
}

export const db: DbType = {
    videos: [
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
}
