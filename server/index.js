import express from "express";
import cors from "cors"; // Importing CORS as ES module
import path from 'path';
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from 'multer';
import userRoute from "./Routes/userRoute.js"; // Ensure you use .js extension
import http from "http";
import { Server as SocketIO } from "socket.io"; // Use named import for Socket.io
import productModel from "./Models/productModel.js";

dotenv.config(); // Load environment variables
const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'))); // Use path.resolve() for better compatibility
app.use('/js', express.static(path.join(path.resolve(), 'js'))); // Serve static files for JS

// Socket.io setup
const server = http.createServer(app);
const io = new SocketIO(server);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage });

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to TradeNest");
});

// Add product route
app.post("/add-product", upload.single('image'), async (req, res) => {
  console.log("Received request to add product", req.body);
  console.log("Uploaded file:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { description, price } = req.body;
  const image = req.file.path; // Get the image path from the uploaded file

  try {
    const product = new productModel({ description, price, image });
    await product.save();
    res.json({ message: 'Product saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products route
app.get('/get-product', async (req, res) => {
  try {
    const products = await productModel.find(); // Use productModel directly
    console.log(products, "product data");
    res.json({ message: 'Success', products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// MongoDB connection
(async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connection established");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
  }
})();

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id); // Log connection
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
