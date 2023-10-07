import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority"
//const dbName = process.env.DB_NAME || "blogs_posts";
export const client = new MongoClient(mongoUri)

export async function runDb() {
    try {
        await client.connect()
        //await client.db(dbName).command({ping: 1})
        console.log("Connection successfully to mongo server")
    } catch (error) {

        console.error('Failed to connect to the database', error);
        await client.close()
    }
}
