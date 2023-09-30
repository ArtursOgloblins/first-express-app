export type Post ={
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string
}

export type DbType = {
    posts: Post[]
}

export const db: DbType = {
    posts : [
        {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string",
            blogName: "string",
            createdAt: "2023-09-30T17:09:04.513Z"
        },
        {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string",
            blogName: "string",
            createdAt: "2023-09-30T17:09:04.513Z"
        }
    ]
}