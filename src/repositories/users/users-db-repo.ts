import {client} from "../db";
import {User} from "../../models/Users";
import {userSanitizer} from "../../helpers/mappers";
import {ObjectId} from "mongodb";

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
        console.log('new user', newUser)
        return userSanitizer({...newUser, _id: res.insertedId})
    },

    async updateUser(id: ObjectId) {
        const res = await usersCollection.updateOne(
            {_id: id},
            {$set: {'emailConfirmation.isConfirmed': true}}
        )
        return res.modifiedCount === 1
    }
}