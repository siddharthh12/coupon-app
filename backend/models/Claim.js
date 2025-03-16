const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    ip: { type: String, required: true },
    browserSession: { type: String, required: true },
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);
module.exports = Claim;
