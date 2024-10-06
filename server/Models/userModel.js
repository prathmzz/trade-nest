import mongoose from "mongoose";
import productModel from "./productModel.js"; // Ensure you include .js extension

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      unique: true,
    },
    password: { type: String, required: true, minLength: 3, maxLength: 100 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Change this to 'Product'
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
