

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

export type AddBlogAttr = {
    name: string
    description: string
    websiteUrl: string
}

export type UpdateBlogAttr = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export type AddPostAttr = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type UpdatePostAttr = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string

}

export type BlogQueryParams = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageSize: number;
    pageNumber: number;
}
