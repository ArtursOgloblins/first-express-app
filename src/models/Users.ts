import {WithId} from "mongodb";

export type User = {
    login: string,
    email: string,
    password: string,
    passwordSalt: string
    createdAt: string
}

export type UserDb = WithId<User>
export type UserOutput = User & { id: string}
export type SanitizedUserOutput = Omit<UserOutput, 'password' | 'passwordSalt'>;

export type PagedUserOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: SanitizedUserOutput[]
}