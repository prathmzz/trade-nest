import express from "express";
import { sendOtp, verifyOtp } from '../Controllers/otpController.js'; // Ensure the .js extension is included
import {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} from "../Controllers/userController.js"; // Add .js extension

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);

router.get("/",getUsers);

router.post("/send-otp", async (req, res) => {
  const email = "mr.mohitpatil003@gmail.com";
  // const { email } = req.body.emailId;
  const result = await sendOtp(email);
  res.json(result);
});



// Route to verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const result = verifyOtp(email, otp);
  res.json(result);
});

export default router;