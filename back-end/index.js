const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Question = require("./model/Question");
const http = require('http');

const app = express();
const port = 3000;
const server = http.createServer(app);
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string
const dbUri = process.env.MONGO_URI;

mongoose
  .connect(dbUri)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));


// Routes
// GET all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    console.log(questions);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Quiz API listening at ${port}`);
});