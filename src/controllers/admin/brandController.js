"use strict";

const Brand = require("../../models/brand");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");
const imageMimeType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

module.exports = {
    /**
     * This function will create a new brand with the provided information
     * 
     * @param {string} req.body.name -The name of the brand
     * @param {string} req.body.image -The image of the brand
     * @returns Brand create and return new brand id
     */
    addBrand: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const brandExist = await Brand.findOne({ name: req.body.name });
            if (brandExist) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.BAD_REQUEST,
                        Msg.BRAND_EXISTS
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

            const brandImage = await services.imageUpload(req.files.image, "brand-logo")
            const brandDetail = {
                name:req.body.name,
                image: brandImage
            };

            const newBrand = await Brand.create(brandDetail);
            return res.send(
                services.prepareResponse(
                    HttpStatus.CREATED,
                    Msg.BRAND_CREATED,
                    { id: newBrand.id }
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
     * This function will list of all brand
     * 
     * @param {string} req.query.search -The search term
     * @param {number} req.query.page -The page number
     * @param {number} req.query.perPage -The number of record per page
     * @param {string} req.query.sortBy -Field to sort by.
     * @param {string} req.query.sortOrder -Sort order: 'asc' or 'desc'.
     * @returns Return All brand
     */
    listBrand: async function (req,res) {
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

            const list = await Brand.find(query)
                .sort(sort)
                .skip(skip)
                .limit(perPage);
        
            const total = await Brand.countDocuments(query);
            const totalPages = Math.ceil(total / perPage);

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    {
                        brand: list,
                        page: page + 1,
                        perPage: perPage,
                        totalRecords: total,
                        totalPages: totalPages,
                    }
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

    /**
     * This function will update a brand with the provided information
     *
     * @param {string} req.params.id -The id of the brand
     * @param {string} req.body.name -The name of the brand
     * @param {string} req.body.image -The image of the brand
     * @returns Update brand and return new id
     */
    updateBrand: async function (req, res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }
    
            const brandId = req.params.id;

            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.BRAND_NOT_FOUND
                    )
                );
            }
    
            let imagePath = brand.image;
            if (req.files && req.files.image) {
                if (!imageMimeType.includes(req.files.image.mimetype)) {
                    return res.send(
                        services.prepareResponse(
                            HttpStatus.BAD_REQUEST,
                            Msg.INVALID_IMAGE_TYPE
                        )
                    );
                }
                if (imagePath) await services.deleteImage(imagePath);
                imagePath = await services.imageUpload(req.files.image, 'brand-logo');
            }
    
            const brandDetail = {
                name: req.body.name,
                image: imagePath
            };

            const updatedBrand = await Brand.findByIdAndUpdate(
                brandId,
                brandDetail,
                { new: true }
            );

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.BRAND_UPDATED,
                    { id: updatedBrand.id }
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
     * This function will delete brand by id
     * 
     * @param {string} req.params.id -The id of the brand
     * @returns Delete brand by id
     */
    deleteBrand : async function (req,res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const brandId = req.params.id;

            // Soft delete by updating `isActive` to false
            const brand = await Brand.findOneAndUpdate(
                { _id: brandId, isActive: true },
                { $set: { isActive: false } },
                { new: true }
            );

            if (!brand) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.BRAND_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.NO_CONTENT,
                    Msg.BRAND_DELETED
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
    }
}