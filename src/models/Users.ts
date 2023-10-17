export type User = {
    userName: string,
    email: string,
    createdAt: string
}

export type UserOutput = User & { id: string}

export type PagedUserOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: UserOutput[]
}