import userModel from "../Models/userModel.js"; 
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    if (!jwtkey) {
        throw new Error("JWT_SECRET_KEY is not defined");
    }
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json("All fields are required");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json("Email must be valid");
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Password must be a strong password");
        }

        let user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json("User with the given email already exists...");
        }

        user = new userModel({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user) return res.status(400).json("Invalid email or password...");
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json("Invalid email or password");
        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Exporting using ES module syntax
export { registerUser, loginUser, findUser, getUsers };
