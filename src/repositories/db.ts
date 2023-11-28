import mongoose from 'mongoose'
import {config} from 'dotenv'
config()

const dbName = process.env.DB_NAME || "blogs_posts"
const mongoUri = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority/${dbName}`
//export const client = new MongoClient(mongoUri)

export async function runDb() {
    try {
        //await client.connect()
        //await client.db(dbName).command({ping: 1})
        await mongoose.connect(mongoUri)
        console.log("Connection successfully to mongo server")
    } catch (error) {

        console.error('Failed to connect to the database', error);
        await mongoose.disconnect()
    }
}
