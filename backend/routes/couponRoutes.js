const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const Claim = require('../models/Claim');

// Middleware to track IP & browser session
const getUserIdentifier = (req) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const browserSession = req.headers['user-agent']; // Use user-agent as session identifier
    return { ip, browserSession };
};

// Get all available coupons
router.get('/available', async (req, res) => {
    try {
        const availableCoupons = await Coupon.find({ status: 'available' });
        res.json(availableCoupons);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Claim a coupon
router.post('/claim', async (req, res) => {
    try {
        const { ip, browserSession } = getUserIdentifier(req);

        // Check if the user has already claimed a coupon
        const existingClaim = await Claim.findOne({ ip, browserSession });
        if (existingClaim) {
            return res.status(403).json({ message: 'You have already claimed a coupon.' });
        }

        // Get the next available coupon (round-robin)
        const coupon = await Coupon.findOneAndUpdate(
            { status: 'available' },
            { status: 'claimed' },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ message: 'No available coupons' });
        }

        // Log the claim
        await Claim.create({ coupon: coupon._id, ip, browserSession });

        res.json({ message: 'Coupon claimed successfully', coupon });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
