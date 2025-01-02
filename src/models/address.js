"use strict";

const mongoose = require("mongoose");

/**
 * Schema for user address detail
 */
const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    apartmentName: {
        type: String,
        required: true
    },
    streetNo: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true
});

module.exports = mongoose.model("Address",addressSchema);