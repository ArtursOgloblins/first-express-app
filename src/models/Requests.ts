import {WithId} from "mongodb";
import {Schema, model} from 'mongoose';

export type ApiRequest = {
    ip: string
    url: string
    date: string
}

export type RequestDb = WithId<ApiRequest>

export const ApiRequestSchema = new Schema<ApiRequest>({
    ip: { type: String, require: true },
    url: { type: String, require: true },
    date: { type: String, require: true }
})

export const ApiRequestModelClass = model('requests', ApiRequestSchema)
