"use strict";

const mongoose = require("mongoose");

/**
 * Schema for brand detail
 */
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true
});

module.exports = mongoose.model("Brand",brandSchema);