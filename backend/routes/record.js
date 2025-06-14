import express from "express";

import dbPromise from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

let db;

dbPromise.then(database => {
  db = database;
}).catch(err => {
  console.error("Failed to connect to the database:", err);
});

router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("records");
    let results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
});

router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      return res.status(404).send("Record not found");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
});

router.post("/", async (req, res) => {
  try {
    let newDocuments = req.body;

    if (!Array.isArray(newDocuments)) {
      newDocuments = [newDocuments];
    }

    let collection = await db.collection("records");

    let result = await collection.insertMany(newDocuments);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding records");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send("Record not found");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = await db.collection("records");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("Record not found");
    }

    res.status(200).send("Record deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
