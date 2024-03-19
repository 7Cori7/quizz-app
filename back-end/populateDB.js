// populateDB.js
require("dotenv").config();
const mongoose = require("mongoose");

const Question = require("./model/Question"); // Adjust the path as necessary to your Question model
const { data } = require("./data"); // Adjust the path to where your data.js file is located

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.error("MongoDB connection error:", err));

const importData = async () => {

  try{

    await Question.deleteMany(); // Optional: clear the collection before insertion
    await Question.insertMany(data);
    console.log("Data successfully imported to MongoDB!");
    mongoose.disconnect();

  }catch(error){

    console.error("Error importing data:", error);
    mongoose.disconnect();
  }
};

importData();