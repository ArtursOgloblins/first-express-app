import {client} from "../db";
import {User} from "../../models/Users";
import {userSanitizer} from "../../helpers/mappers";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const usersCollection = db.collection<User>("users");

export const usersRepository = {
    async createUser(newUser: User) {
        const res = await usersCollection.insertOne(newUser)
        return userSanitizer({...newUser, _id: res.insertedId})
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },

    async registerUser(newUser: User)  {
        const res = await usersCollection.insertOne(newUser)
        return userSanitizer({...newUser, _id: res.insertedId})
    }
}