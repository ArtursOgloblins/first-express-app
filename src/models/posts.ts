export type Post ={
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type DbType = {
    posts: Post[]
}

export const db: DbType = {
    posts : [
        {
            id: "0",
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string",
            blogName: "string"
        },
        {
            id: "1",
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string",
            blogName: "string"
        }
    ]
}