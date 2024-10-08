import express from "express";
import cors from "cors";
import path from 'path';
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from 'multer';
import http from "http";
import { Server as SocketIO } from "socket.io"; // Use named import for Socket.io
import productModel from "./Models/productModel.js"; // Ensure correct model path
import userRoute from "./Routes/userRoute.js"; // Importing user routes
import homeRoutes from "./Routes/homeRoutes.js"; // Importing home routes


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use("/api/users", userRoute);
app.use("/api/home/", homeRoutes);

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

  const { title, description, price, location, category } = req.body;
  const image = req.file.path;
  const email = req.body.email; // Ensure email is included
  console.log("Request body:", req.body);



  try {
    const product = new productModel({
      title,
      description,
      price,
      location,
      category,
      image,
      email
    });

    await product.save();
    res.json({ message: 'Product saved successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

// Get products route
app.get('/get-product', async (req, res) => {
  const email = req.query.email;
  try {
    const products = await productModel.find({ email });
    console.log(products, "product data");
    res.json({ message: 'Success', products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add Listing route
app.post("/add-listing", upload.single('image'), async (req, res) => {
  console.log("Received request to add listing", req.body);
  console.log("Uploaded file:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { description, price, email } = req.body;
  const image = req.file.path;

  try {
    const listing = new listingModel({ description, price, image, email });
    await listing.save();
    console.log("Listing saved:", listing);
    res.json({ message: 'Listing saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Listings route
app.get('/get-listings', async (req, res) => {
  const email = req.query.email;

  try {
      const listings = await productModel.find({ email }).sort({ createdAt: -1 });
      res.json({ listings });
  } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).send("Server Error");
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
const server = http.createServer(app);
const io = new SocketIO(server);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
