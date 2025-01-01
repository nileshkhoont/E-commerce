"use strict";

const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");
const SubCategory = require("../../models/subCategory");

module.exports = {
    /**
     * This function will create a new subCategory with the provided information 
     * 
     * @param {string} req.body.name -The name of the subCategory
     * @param {string} req.body.categoryId -The id of the category
     * @returns subCategory create and return new subCategory id
     */
    addSubCategory : async function (req,res){
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const subCategoryExist = await SubCategory.findOne({ name: req.body.name });
            if (subCategoryExist) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.BAD_REQUEST,
                        Msg.SUB_CATEGORY_EXISTS
                    )
                );
            }
            
            const subCategoryDetail = {
                name: req.body.name,
                categoryId: req.body.categoryId
            };

            const newSubCategory = await SubCategory.create(subCategoryDetail);
            return res.send(
                services.prepareResponse(
                    HttpStatus.CREATED,
                    Msg.SUB_CATEGORY_CREATED,
                    { id: newSubCategory.id }
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
     * This function will list of all sub category
     * 
     * @param {string} req.query.search -The search term
     * @param {number} req.query.page -The page number
     * @param {number} req.query.perPage -The number of record per page
     * @param {string} req.query.sortBy -Field to sort by.
     * @param {string} req.query.sortOrder -Sort order: 'asc' or 'desc'.
     * @returns Return All subCategory
     */
    listSubCategory: async function (req,res) {
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

            const list = await SubCategory.find(query)
                .populate("categoryId", "name -_id")
                .sort(sort)
                .skip(skip)
                .limit(perPage);

            const total = await SubCategory.countDocuments(query);
            const totalPages = Math.ceil(total / perPage);

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    {
                        subCategory: list,
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
     * This function will update a subCategory with the provided information
     * 
     * @param {string} req.params.id -The id of the subCategory
     * @param {string} req.body.name -The name of the category
     * @param {string} req.body.categoryId -The id of the category
     * @returns Update subCategory and return new id
     */
    updateSubCategory: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const subCategoryId = req.params.id;

            const subCategory = await SubCategory.findById(subCategoryId);
            if (!subCategory) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.SUB_CATEGORY_NOT_FOUND
                    )
                );
            }
            
            const subCategoryDetail = {
                name: req.body.name,
                categoryId: req.body.categoryId
            };

            const updatedSubCategory = await SubCategory.findByIdAndUpdate(
                subCategoryId,
                subCategoryDetail,
                { new: true }
            );

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUB_CATEGORY_UPDATED,
                    { id: updatedSubCategory.id }
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
     * This function will delete subCategory by id
     * 
     * @param {string} req.params.id -The id of the subCategory
     * @returns Delete subCategory by id
     */
    deleteSubCategory : async function (req,res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const subCategoryId = req.params.id;

            // Soft delete by updating `isActive` to false
            const subCategory = await SubCategory.findOneAndUpdate(
                { _id: subCategoryId, isActive: true },
                { $set: { isActive: false } },
                { new: true }
            );

            if (!subCategory) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.SUB_CATEGORY_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.NO_CONTENT,
                    Msg.SUB_CATEGORY_DELETED
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

