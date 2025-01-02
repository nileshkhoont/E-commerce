"use strict";

const mongoose = require("mongoose");

/**
 * Schema for product detail
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    size: {
        type: [String],
        required: true
    },
    color: {
        type: [String],
        required: true
    },
    stock: {
        type: Number,
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

module.exports = mongoose.model("Product",productSchema);
