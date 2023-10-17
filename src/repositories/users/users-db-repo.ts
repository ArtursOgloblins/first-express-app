import {client} from "../db";
import {User} from "../../models/Users";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const usersCollection = db.collection<User>("users");

export const usersRepository = {
    async createUser(newUser: User) {
        const res = await usersCollection.insertOne(newUser)
        return res.insertedId.toString()
    }
}