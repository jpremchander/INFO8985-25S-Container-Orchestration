import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}

const app = express();

// Ensure logs directory exists
const logDirectory = path.join("logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });

// Setup morgan for logging HTTP requests
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
app.use(express.json());

// MongoDB client and database reference
let db;

// Connect to MongoDB and then start server
async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Get database reference (change 'employees' to your DB name if different)
    db = client.db();

    // Pass the db reference to routes (if needed)
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use("/record", records);

    // Simple test endpoint
    app.use("/0", (req, res) => {
      res.send("Hello World");
    });

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();

export default app;
// Export the app for testing purposes