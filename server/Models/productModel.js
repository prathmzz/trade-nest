import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: String,
    price: String,
    image: String
});

const productModel = mongoose.model("Product", productSchema);

// Use this line for default export
export default productModel;
