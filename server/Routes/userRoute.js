const express = require("express");
const { sendOtp, verifyOtp } = require("../Controllers/otpController");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../Controllers/userController");
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


module.exports = router;