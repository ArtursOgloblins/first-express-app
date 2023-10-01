export type Blog = {
    id: string
    name: string;
    description: string;
    websiteUrl: string;
    "createdAt": string;
    "isMembership": boolean
}

export type WithId<T> = T & { _id: any };

export type DbType = {
    blogs: Blog[]
}

// export const db: DbType = {
//     blogs: [
//         {
//             name: "Blog1",
//             description: "Description1",
//             websiteUrl: "https://1S3pr27EQB_gTK2wORcEqiEBzf0Quyuwox48XGPH-1o-y9iw91ypoRJSlWQjcAIfd3Bzc4TkyCA7n8I_.tmr4eDjXp6V",
//             "createdAt": "2023-09-29T13:59:16.654Z",
//             "isMembership": true
//         },
//         {
//             name: "Blog2",
//             description: "Description2",
//             websiteUrl: "https://1S3pr27EQB_gTK2wORcEqiEBzf0Quyuwox48XGPH-1o-y9iw91ypoRJSlWQjcAIfd3Bzc4TkyCA7n8I_.tmr4eDjXp6D",
//             "createdAt": "2023-09-29T13:59:16.654Z",
//             "isMembership": true
//         }
//     ]
//}