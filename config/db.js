require('dotenv').config(); 
const mongoose = require("mongoose");

const connectDB = async () => {
    
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;