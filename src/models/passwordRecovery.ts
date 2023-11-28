import {ObjectId, WithId} from "mongodb";
import {model, Schema} from "mongoose";

export type PasswordRecovery = {
    userId: ObjectId
    confirmationCode: string,
    expirationDate: string,
    isValid: boolean
}

export type PasswordRecoveryDb = WithId<PasswordRecovery>

export type PasswordRecoveryOutput = {
    userId: ObjectId
    confirmationCode: string,
    expirationDate: string,
    isValid: boolean
}

export const PasswordRecoverySchema = new Schema<PasswordRecovery>({
    userId: {type: Schema.Types.ObjectId, required: true},
    confirmationCode: { type: String, required: true, unique: true},
    expirationDate: { type: String, required: true },
    isValid: {type: Boolean, required: true},

})
export const PasswordRecoveryModel = model('passwordRecovery', PasswordRecoverySchema)

