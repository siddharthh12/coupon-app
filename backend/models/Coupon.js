const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    status: { type: String, enum: ['available', 'claimed'], default: 'available' },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', default: null }, // Tracks who claimed it
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
