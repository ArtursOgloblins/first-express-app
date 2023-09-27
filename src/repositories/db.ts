import {MongoClient} from 'mongodb'

const mongoUri =
    process.env.mongoUri || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority"

export const client = new MongoClient(mongoUri)

export async function runDb() {
    try {
        //Connect client to the server
        await client.connect()
        //Establish and verify connection
        await client.db("TestDB").command({ping: 1})
        console.log("Connection successfully to mongo server")
    } catch {
        // Ensures that the client will close when you finish/over
        await client.close()
    }
}