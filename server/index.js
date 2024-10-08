import express from "express";
import cors from "cors"; // Importing CORS as ES module
import path from 'path';
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from 'multer';
import http from "http";
import { Server as SocketIO } from "socket.io"; // Use named import for Socket.io
import productModel from "./Models/productModel.js"; // Ensure correct model path
import userRoute from "./Routes/userRoute.js"; // Importing user routes
import homeRoutes from "./Routes/homeRoutes.js"; // Importing favourite routes


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


app.use("/api/users", userRoute);
app.use("/api/home/", homeRoutes); 


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

app.get("/", (req, res) => {
  res.send("Welcome to TradeNest");
});

app.post("/add-product", upload.single('image'), async (req, res) => {
  console.log("Received request to add product", req.body);
  console.log("Uploaded file:", req.file);

  // Check if the file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Destructure the required fields from req.body
  const { title, description, price, location, category } = req.body;
  const image = req.file.path; // Get the image path from the uploaded file

  try {
    // Create a new product object with all the required fields
    const product = new productModel({
      title,
      description,
      price,
      location,
      category,
      image,
    });

    // Save the product to the database
    await product.save();
    res.json({ message: 'Product saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products route


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
const server = http.createServer(app);
const io = new SocketIO(server);

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
