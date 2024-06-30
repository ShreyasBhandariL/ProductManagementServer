const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://shreyasbhandaricse:hkjaGxM5AEtK4Twi@test.nn11wv9.mongodb.net/project1"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

module.exports = connectDb;
