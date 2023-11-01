import {User} from "../models/Users";
import {WithId} from "mongodb";

declare global {
    declare namespace Express {
        export interface Request {
            user: WithId<User> | null
        }
    }
}