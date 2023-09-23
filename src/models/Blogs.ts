export type Blog = {
    id: number;
    name: string;
    description: string;
    websiteUrl: string;
}

export type DbType = {
    blogs: Blog[]
}

export const db: DbType = {
    blogs: [
        {
            id: 0,
            name: "Blog1",
            description: "Description1",
            websiteUrl: "https://1S3pr27EQB_gTK2wORcEqiEBzf0Quyuwox48XGPH-1o-y9iw91ypoRJSlWQjcAIfd3Bzc4TkyCA7n8I_.tmr4eDjXp6V"
        },
        {
            id: 1,
            name: "Blog2",
            description: "Description2",
            websiteUrl: "https://1S3pr27EQB_gTK2wORcEqiEBzf0Quyuwox48XGPH-1o-y9iw91ypoRJSlWQjcAIfd3Bzc4TkyCA7n8I_.tmr4eDjXp6D"
        }
    ]
}