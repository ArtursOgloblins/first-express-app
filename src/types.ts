

export type CreateVideoAttr = {
    title: string
    author: string
    availableResolutions: string[]
}

export type UpdateVideoAttr ={
    id: number
    title: string
    author: string
    availableResolutions: string[]
    canBeDownloaded: boolean;
    minAgeRestriction: number | null
    publicationDate: string
}