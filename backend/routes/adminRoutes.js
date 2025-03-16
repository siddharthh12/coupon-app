const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Coupon = require('../models/Coupon');
const Claim = require('../models/Claim');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware for authentication
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

// Admin Login
router.post('/login', async (req, res) => {
    const { username } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚨 TEMPORARY: Bypass password check
    // const isPasswordValid = await bcrypt.compare(password, admin.password);
    // if (!isPasswordValid) {
    //     return res.status(401).json({ message: "Invalid credentials" });
    // }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});


router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        
        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword); // Log the hashed password

        // Create new admin
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        res.json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Get all coupons
router.get('/coupons', authenticateAdmin, async (req, res) => {
    const coupons = await Coupon.find();
    res.json(coupons);
});

// Add a new coupon
router.post('/add-coupon', authenticateAdmin, async (req, res) => {
    const { code } = req.body;
    try {
        const newCoupon = await Coupon.create({ code, status: 'available' });
        res.json(newCoupon);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get claim history
router.get('/claim-history', authenticateAdmin, async (req, res) => {
    const claims = await Claim.find().populate('coupon');
    res.json(claims);
});

// Update an existing coupon (Edit Coupon)
router.put('/update-coupon/:id', authenticateAdmin, async (req, res) => {
    try {
        const { code, status } = req.body;
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, { code, status }, { new: true });
        res.json(updatedCoupon);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update coupon' });
    }
});

// Get User Claim History
router.get('/claim-history', authenticateAdmin, async (req, res) => {
    try {
        const claims = await Claim.find().populate('coupon');
        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch claim history' });
    }
});

// DELETE a coupon
router.delete("/delete-coupon/:id", async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting coupon" });
    }
});


module.exports = router;
