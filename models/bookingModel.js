// Import Dependencies
const mongoose = require("mongoose");
// const Repair = require("../models/repairModel");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New Device Schema
const bookSchema = new Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  orderNumber:{
   type: String
  },
  shop: {
    type: mongoose.Types.ObjectId,
    ref: "Shop",
  },
  device: {
    type: mongoose.SchemaTypes,
    ref: "Devie",
  },
  model: {
    type: mongoose.SchemaTypes,
    ref: "Devie",
  },
  customerInfo: {
    type: Object,
  },
  location: {
    type: Object,
  },
  status: {
    type: String,
    enum: ["pending","confirmed","canceled","completed"],
    default: "pending",
  },
  repaires: {
    type: mongoose.SchemaTypes,
    ref: "Repair",
  },
  service: {
    type: String,
    enum: ["we-come-to-you", "mail-in"],
  },
  appointmentTime: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Export book Schema
module.exports = mongoose.model("Booking", bookSchema);
