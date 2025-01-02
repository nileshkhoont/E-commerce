"use strict";

const mongoose = require("mongoose");

/**
 * Schema for coupon detail
 */
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    maxUses: {
        type: Number,
        required: true
    },
    usedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    updatedAt: Date
},
{
    timestamps: true
});

module.exports = mongoose.model("Coupon",couponSchema);