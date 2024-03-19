const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // For handling cross-origin requests
// const helmet = require('helmet'); // Import helmet
// const csrf = require('csurf'); // Import csurf
// const cookieParser = require('cookie-parser'); // Import cookie-parser for CSRF token handling
const Question = require("./model/Question");

const app = express();
const port = 3000;
require("dotenv").config();

// Middleware
app.use(cors()); // Use this to allow cross-origin requests
app.use(express.json()); // For parsing application/json
// app.use(helmet()); // Use helmet to set secure HTTP headers
// app.use(cookieParser()); // Use cookie-parser middleware

// // CSRF protection
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

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
app.listen(port, "0.0.0.0", () => {
  console.log(`Quiz API listening at http://0.0.0.0:${port}`);
});