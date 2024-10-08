import mongoose from "mongoose";

// Define a schema for the Listing model
const listingSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true }, // The user's email to associate listings
  createdAt: { type: Date, default: Date.now } // Automatically add created date
});

// Create the Listing model
const listingModel = mongoose.model("Listing", listingSchema);

export default listingModel;
