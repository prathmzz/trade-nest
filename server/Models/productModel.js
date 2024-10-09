        import mongoose from "mongoose";

        const productSchema = new mongoose.Schema({
            title: {
              type: String,
              required: true,
              trim: true,
              maxlength: 100
            },
            description: {
              type: String,
              required: true,
              maxlength: 1000
            },
            price: {
              type: Number,
              required: true,
              min: 0
            },
            image: {
              type: String,
              required: true
            },
            category: {
              type: String,
              required: true,
              trim: true,
              set: (value) => value.toLowerCase(), 
            },
            location: {
              type: String,
              required: true
            },
            email: {
              type: String,
              required: true,  // Ensure email is required
              trim: true
            }
          });
          

        const productModel = mongoose.model("Product", productSchema);

        export default productModel;
