// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  type: {
    type: String,
    required: true,
    default: "customer",
    enum: ["customer", "manager", "admin"],
  },
  address: [
    {
      long: Number,
      lat: Number,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipcode: Number,
    },
  ],
  loaction: {
    type: Object,
  },
  resetToken: String,
  resertTokenExpiration: Date,
});

// Export User Schema
module.exports = mongoose.model("User", userSchema);
