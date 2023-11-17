import {WithId} from "mongodb";

export type ApiRequest = {
    ip: string
    url: string
    date: string
}

export type RequestDb = WithId<ApiRequest>
