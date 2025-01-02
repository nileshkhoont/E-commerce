"use strict";

const ProductModel = require("../../models/product");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");

module.exports = {
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
     * This function will return product detail by id
     * 
     * @param {string} req.params.id -The id of the product
     * @return Return product detail by id
     */
    productDetail: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const productId = req.params.id;
            
            const productInfo = await ProductModel.findById(productId);
            if (!productInfo) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.PRODUCT_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    { productInfo }
                )
            );

        } catch (error){
            return res.send(
                services.prepareResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Msg.SERVER_ERROR
                )
            );
        }
    },
}