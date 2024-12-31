"use strict";

const Category = require("../../models/category");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");

module.exports = {
    /**
     * This function will create a new category with the provided information
     * 
     * @param {string} req.body.name -The name of the category
     * @returns Category create and return new category id
     */
    addCategory: async function (req,res){
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }
            
            const categoryExist = await Category.findOne({ name: req.body.name });
            if (categoryExist) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.BAD_REQUEST,
                        Msg.CATEGORY_EXISTS
                    )
                );
            }

            const categoryDetail = {
                name: req.body.name,
            };

            const newCategory = await Category.create(categoryDetail);
            return res.send(
                services.prepareResponse(
                    HttpStatus.CREATED,
                    Msg.CATEGORY_CREATED,
                    { id: newCategory.id }
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
     *  This function will list of all category
     * 
     * @param {string} req.query.search -The search term
     * @param {number} req.query.page -The page number
     * @param {number} req.query.perPage -The number of record per page
     * @param {string} req.query.sortBy -Field to sort by.
     * @param {string} req.query.sortOrder -Sort order: 'asc' or 'desc'.
     * @returns Return All category
     */
    listCategory: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
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

            const list = await Category.find(query)
                .sort(sort)
                .skip(skip)
                .limit(perPage);
            
            const total = await Category.countDocuments(query);
            const totalPages = Math.ceil(total / perPage);

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    {
                        category: list,
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
     * This function will update a category with the provided information
     * 
     * @param {string} req.params.id -The id of the category
     * @param {string} req.body.name -The name of the category
     * @returns Update category and return new id
     */
    updateCategory: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const categoryId = req.params.id;

            const category = await Category.findById(categoryId);
            if (!category) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.CATEGORY_NOT_FOUND
                    )
                );
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { name: req.body.name },
                { new: true } 
            );

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.CATEGORY_UPDATED,
                    { id: updatedCategory.id }
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
     * This function will delete category by id
     * 
     * @param {string} req.params.id -The id of the category
     * @returns Delete category by id
     */
    deleteCategory : async function (req,res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const categoryId = req.params.id;

            const category = await Category.findById(categoryId);
            if (!category) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.CATEGORY_NOT_FOUND
                    )
                );
            }
            
            category.isActive = false;
            await category.save();

            return res.send(
                services.prepareResponse(
                    HttpStatus.NO_CONTENT,
                    Msg.CATEGORY_DELETED
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

