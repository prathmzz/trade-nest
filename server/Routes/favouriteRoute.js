import express from 'express';
import { Router } from 'express';
import User from "../Models/userModel.js" // Adjust the path as needed

const router = express.Router();

// Add product to favorites
router.post('/:userId/favorites', async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
            return res.status(200).json(user);
        }
        res.status(400).send('Product already in favorites');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove product from favorites
router.delete('/:userId/favorites', async (req, res) => {
    console.log(req.params.userId);
    try {
        const { productId } = req.body;
        const user = await User.findById(req.params.userId);
        user.favorites = user.favorites.filter(id => id.toString() !== productId);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;