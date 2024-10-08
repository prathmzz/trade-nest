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
        trim: true
    },
    location: {
        type: String,
        required: true
    }
    // stock: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
