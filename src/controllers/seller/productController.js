"use strict";

const ProductModel = require("../../models/product");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");
const imageMimeType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

module.exports = {
    /**
     * This function will create a new product with the provided information
     *
     * @param {string} req.body.name -The name of the product
     * @param {string} req.body.categoryId -The id of the product category
     * @param {string} req.body.subCategoryId -The id of the product subCategory
     * @param {string} req.body.brandId -The id of the product brand
     * @param {number} req.body.price -The price of the product
     * @param {string} req.body.description -The description of the product
     * @param {string} req.body.image -Image of the product
     * @param {string} req.body.size -The size of the product
     * @param {string} req.body.color -The color of the product
     * @param {number} req.body.stock -The stock quantity of the product
     * @returns Product create and return new product id 
     */
    addProduct: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const productExist = await ProductModel.findOne({ name: req.body.name });
            if (productExist) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.BAD_REQUEST,
                        Msg.PRODUCT_EXISTS
                    )
                );
            }

            if (!req.files || !req.files?.image) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.BAD_REQUEST,
                        Msg.IMAGE_IS_REQUIRED
                    )
                )
            }

            if (!imageMimeType.includes(req.files.image.mimetype)) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.BAD_REQUEST,
                        Msg.INVALID_IMAGE_TYPE
                    )
                )
            }

            const productImage = await services.imageUpload(req.files.image, "product-image")
            const productDetail = {
                name: req.body.name,
                categoryId: req.body.categoryId,
                subCategoryId: req.body.subCategoryId,
                brandId: req.body.brandId,
                price: req.body.price,
                description: req.body.description,
                image: productImage,
                size: req.body.size,
                color: req.body.color,
                stock: req.body.stock,
            };
            
            const newProduct = await ProductModel.create(productDetail);
            return res.send(
                services.prepareResponse(
                    HttpStatus.CREATED,
                    Msg.PRODUCT_CREATED,
                    { id: newProduct.id }
                )
            );

        } catch(error) {
            return res.send(
                services.prepareResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Msg.SERVER_ERROR
                )
            );
        }
    },

    /**
     * This function will list of all product
     * 
     * @param {string} req.query.search -The search term
     * @param {number} req.query.page -The page number
     * @param {number} req.query.perPage -The number of record per page
     * @param {string} req.query.sortBy -Field to sort by.
     * @param {string} req.query.sortOrder -Sort order: 'asc' or 'desc'.
     * @returns Return all product list
     */
    listProduct: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const { perPage, page, skip } = services.parsePagination(req.query);
            let query = { isActive: true };
            let sort = {};
    
            if (req.query.search) {
                query.$or = [
                    { name: { $regex: req.query.search, $options: 'i' } },
                ];
            }

            if (req.query.sortBy) {
                sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
            }
    
            // Aggregation pipeline for fetching products
            const pipeline = [
                { $match: query },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categoryDetail",
                    },
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "subCategoryId",
                        foreignField: "_id",
                        as: "subCategoryDetail",
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        localField: "brandId",
                        foreignField: "_id",
                        as: "brandDetail",
                    },
                },
                {
                    $unwind: {
                        path: "$categoryDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$subCategoryDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$brandDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        size: 1,
                        color: 1,
                        "categoryDetail.name": 1,
                        "subCategoryDetail.name": 1,
                        "brandDetail.name": 1,
                    },
                },
                { $sort: sort },
                { $skip: skip },
                { $limit: perPage },
            ];
    
            const list = await ProductModel.aggregate(pipeline).exec();
            const total = await ProductModel.countDocuments(query).exec();
            const totalPages = Math.ceil(total / perPage);
    
            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    {
                        product: list,
                        page: page + 1,
                        perPage: perPage,
                        totalRecords: total,
                        totalPages: totalPages,
                    }
                )
            );
    
        } catch (error) {
            return res.send(
                services.prepareResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Msg.SERVER_ERROR
                )
            );
        }
    },    

    /** 
     * This function will update a product with the provided information
     * 
     * @param {string} req.params.id -The id of the product
     * @param {string} req.body.name -The name of the product
     * @param {string} req.body.categoryId -The id of the product category
     * @param {string} req.body.subCategoryId -The id of the product subCategory
     * @param {string} req.body.brandId -The id of the product brand.
     * @param {number} req.body.price -The price of the product
     * @param {string} req.body.description -The description of the product
     * @param {string} req.body.image -Image of the product
     * @param {string} req.body.size -The size of the product
     * @param {string} req.body.color -The color of the product
     * @param {number} req.body.stock -The stock quantity of the product
     * @returns Update product and return new product id
     */
    updateProduct: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }
    
            const productId = req.params.id;

            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.PRODUCT_NOT_FOUND
                    )
                );
            }

            // Handle image upload if new image is provided    
            let productImage = product.image;
            if (req.files && req.files.image) {
                if (!imageMimeType.includes(req.files.image.mimetype)) {
                    return res.send(
                        services.prepareResponse(
                            HttpStatus.BAD_REQUEST,
                            Msg.INVALID_IMAGE_TYPE
                        )
                    );
                }
                if (productImage) await services.deleteImage(productImage);
                productImage = await services.imageUpload(req.files.image, 'product-image');
            }
    
            const productDetail = {
                name: req.body.name,
                categoryId: req.body.categoryId,
                subCategoryId: req.body.subCategoryId,
                brandId: req.body.brandId,
                price: req.body.price,
                description: req.body.description,
                image: productImage,
                size: req.body.size,
                color: req.body.color,
                stock: req.body.stock,
            };

            // Update product details in the database
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                productId,
                productDetail,
                { new: true }
            );

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.PRODUCT_UPDATED,
                    { id: updatedProduct.id }
                )
            );
    
        } catch (error) {
            return res.send(
                services.prepareResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Msg.SERVER_ERROR
                )
            );
        }
    },

    /**
     * This function will delete product by Id
     * 
     * @param {string} req.params.id -The id of the product
     * @return Delete product by id
     */
    deleteProduct: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }
            
            const productId = req.params.id;

            // Soft delete by updating `isActive` to false
            const product = await ProductModel.findOneAndUpdate(
                { _id: productId, isActive: true },
                { $set: { isActive: false } },
                { new: true }
            );

            if (!product) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.PRODUCT_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.NO_CONTENT,
                    Msg.PRODUCT_DELETED,
                )
            );
            
        } catch (error) {
            return res.send(
                services.prepareResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Msg.SERVER_ERROR
                )
            );
        }
    },
}