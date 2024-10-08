import express from "express";
// import { Router } from 'express';
import User from "../Models/userModel.js"; // Adjust the path as needed
import productModel from "../Models/productModel.js"; // Ensure correct model path


const router = express.Router();

// Get products route
router.get("/get-product", async (req, res) => {
  try {
    const products = await productModel.find(); // Use productModel directly
    console.log(products, "product data");
    res.json({ message: "Success", products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add product to favorites
router.post("/:userId/favorites", async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
      return res.status(200).json(user);
    }
    res.status(400).send("Product already in favorites");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove product from favorites
router.delete("/:userId/favorites", async (req, res) => {
  console.log(req.params.userId);
  try {
    const { productId } = req.body;
    const user = await User.findById(req.params.userId);
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
