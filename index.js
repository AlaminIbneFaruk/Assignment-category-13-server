const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stnyf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    // Example database and collection
    const database = client.db("ArtifactBazaar");
    const collection = database.collection("artifacts");

    // GET route to fetch all artifacts
    app.get("/all-Artifacts", async (req, res) => {
      try {
        const artifacts = await collection.find().toArray();
        res.send(artifacts);
      } catch (error) {
        res.status(500).send({
          message: "Failed to fetch artifacts",
          error: error.message,
        });
      }
    });
    // POST route to add new artifact
    app.post("/add-Artifact", async (req, res) => {
      const artifact = req.body;
      try {
        const result = await collection.insertOne(artifact);
        res.status(201).send({
          message: "Artifact added successfully",
          result,
        });
      } catch (error) {
        res.status(500).send({
          message: "Failed to add artifact",
          error: error.message,
        });
      }
    });


    // Ping the database
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

run().catch((error) => console.error(error));

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
