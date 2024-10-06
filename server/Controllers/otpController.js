import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv"; // Import dotenv to use it

dotenv.config(); // Load environment variables

let otpStore = {}; // Temporary store for OTPs

// Email transporter setup (use your email credentials)
const transporter = nodemailer.createTransport({
    service: "gmail", // Or any other mail service
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.App_Email, // Corrected here
        pass: process.env.App_Email_Password, // Corrected here
    },
});

// Generate OTP and send email
const sendOtp = async (email) => {
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP

    // Store OTP for the user (you can store it in a database instead)
    otpStore[email] = otp;

    const mailOptions = {
        from: "tradenestsem5@gmail.com",
        to: email,
        subject: "Your OTP for registration",
        text: `Your OTP is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent to " + email); // Added space for better readability
        return { success: true, message: "OTP sent successfully!" };
    } catch (error) {
        console.error("Failed to send OTP:", error); // Log the actual error
        return { success: false, message: "Failed to send OTP!" };
    }
};

// Verify OTP
const verifyOtp = (email, otp) => {
    if (otpStore[email] && otpStore[email] == otp) {
        delete otpStore[email]; // Clear OTP after verification
        return { success: true, message: "OTP verified successfully!" };
    }
    return { success: false, message: "Invalid OTP or OTP expired!" };
};

// Exporting using ES module syntax
export { sendOtp, verifyOtp };
