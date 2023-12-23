import {WithId} from "mongodb";
import mongoose, {Schema, model} from 'mongoose';

export class AccountData {
    constructor(public login: string,
                public email: string,
                public password: string,
                public passwordSalt: string,
                public createdAt: string) {
    }
}

export class EmailConfirmation {
    constructor(public confirmationCode: string,
                public expirationDate: Date,
                public isConfirmed: boolean) {
    }
}

export class User {
    constructor(public accountData: AccountData,
                public emailConfirmation: EmailConfirmation) {
    }
}

export type UserDb = WithId<User>

export type UserOutput = User & { id: string}

export type SanitizedUserOutput = Omit<UserOutput, 'accountData' | 'emailConfirmation'> & {
    login: string;
    email: string;
    createdAt: string;
}

interface UserMethods {
    canBeConfirmed: (code: string) => boolean;
    confirmRegistration: (code: string) => void;
}

interface UserStaticMethods {
    createUser: (accountData: AccountData, emailConfirmation: EmailConfirmation) => User
}

interface UserDocument extends Document, User, UserMethods {}

interface UserModelType extends mongoose.Model<UserDocument>, UserStaticMethods {}

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
    isConfirmed: { type: Boolean, required: true, default: false }
});

export const UserSchema = new Schema<User>({
    accountData: { type: AccountDataSchema, required: true },
    emailConfirmation: { type: EmailConfirmationSchema, required: true }
})

UserSchema.method('canBeConfirmed', function(this: UserDocument, code: string) {
    return this.emailConfirmation.confirmationCode === code && this.emailConfirmation.expirationDate > new Date()
})

UserSchema.method('confirmRegistration', function confirmRegistration (this: UserDocument, code: string){
    if (this.canBeConfirmed(code)) throw new Error(`User can't be confirmed`)
    if (this.emailConfirmation.isConfirmed) throw new Error('User already confirmed')
    this.emailConfirmation.isConfirmed = true
})

UserSchema.static('createUser', function createUser(accountData, emailConfirmation) {
    return new UserModel({
        accountData,
        emailConfirmation
    })
})

export const UserModel = model<User, UserModelType>('Users', UserSchema)
