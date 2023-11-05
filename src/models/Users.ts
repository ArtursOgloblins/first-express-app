import {WithId} from "mongodb";

type AccountData = {
    login: string;
    email: string;
    password: string;
    passwordSalt: string;
    createdAt: string;
};

type EmailConfirmation = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};

export type User = {
    accountData: AccountData;
    emailConfirmation: EmailConfirmation;
};

export type UserDb = WithId<User>
export type UserOutput = User & { id: string}
export type SanitizedUserOutput = Omit<UserOutput, 'accountData' | 'emailConfirmation'> & {
    login: string;
    email: string;
    createdAt: string;
}

export type PagedUserOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: SanitizedUserOutput[]
}
