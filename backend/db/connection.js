import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); 

const URI = process.env.MONGODB_URI; 

if (!URI) {
    console.error("Error: MongoDB URI is not defined in the environment variables.");
    process.exit(1); 
}

const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB Atlas!");
        return client.db("employees"); 
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

const dbPromise = connectToDatabase();
export default dbPromise;
