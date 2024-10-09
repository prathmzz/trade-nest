import express from "express";
import User from "../Models/userModel.js"; // Adjust the path as needed
import productModel from "../Models/productModel.js"; // Ensure correct model path

const router = express.Router();

// Filter and get products based on filters
router.post("/get-product", async (req, res) => {
  try {
    const filters = req.body; // Get filters from the request body
    let query = {}; // Initialize an empty query object

    // Apply category filter if provided
    if (filters.category && filters.category.length > 0) {
      // Convert the filter categories to lowercase
      const lowerCaseCategories = filters.category.map(cat => cat.toLowerCase());
      query.category = { $in: lowerCaseCategories };
    }

    // Apply price range filter if provided
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split('-').map(price => parseInt(price.replace('$', '')));
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Fetch products based on the constructed query
    const products = await productModel.find(query); // Query the productModel with the filters

    if((query.category || query.price ) && !products.length) {
      res.status(404).json({ message: "No products found" });
      console.log("No products found");
      return;
    }

    console.log(products, "Filtered product data");
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
