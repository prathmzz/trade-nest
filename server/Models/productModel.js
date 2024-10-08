    import mongoose from "mongoose";

    const productSchema = new mongoose.Schema({
        description: String,
        price: String,
        image: String,
        email: String, // Include email
    });
    
    

    const productModel = mongoose.model("Product", productSchema);

    export default productModel;
