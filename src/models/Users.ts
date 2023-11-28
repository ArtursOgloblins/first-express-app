import {WithId} from "mongodb";
import { Schema, model } from 'mongoose';

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


const AccountDataSchema = new Schema<AccountData>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    createdAt: { type: String, required: true }
});

const EmailConfirmationSchema = new Schema<EmailConfirmation>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
});

export const UserSchema = new Schema<User>({
    accountData: { type: AccountDataSchema, required: true },
    emailConfirmation: { type: EmailConfirmationSchema, required: true }
});

export const UserModelClass = model('Users', UserSchema)
