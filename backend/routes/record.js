import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
  try {
    const collection = req.db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
});

// Get one record by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = req.db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).send("Record not found");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
});

// Create new records (single or multiple)
router.post("/", async (req, res) => {
  try {
    let newDocuments = req.body;
    if (!Array.isArray(newDocuments)) {
      newDocuments = [newDocuments];
    }

    const collection = req.db.collection("records");
    const result = await collection.insertMany(newDocuments);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding records");
  }
});

// Update a record by ID
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

    const collection = req.db.collection("records");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send("Record not found");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = req.db.collection("records");
    const result = await collection.deleteOne(query);

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
