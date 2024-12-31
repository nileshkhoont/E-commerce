"use strict";

const User = require("../../models/auth");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");

module.exports = {
    /**
     * This function will list of all user
     * 
     * @param {string} req.query.search -Search query for first name or last name.
     * @param {number} req.query.page -The page number
     * @param {number} req.query.perPage -The number of record per page
     * @param {string} req.query.sortBy -Field to sort by.
     * @param {string} req.query.sortOrder -Sort order: 'asc' or 'desc'.
     * @returns Return all user
     *
     */ 
    listUser: async function (req, res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }

            const { perPage, page, skip } = services.parsePagination(req.query);
            let query = {
                type: "User",
                isDeleted: false,
            };
            
            if (req.query.search) {
                query.$or = [
                    { firstName: { $regex: req.query.search, $options: 'i' } },
                    { lastName: { $regex: req.query.search, $options: 'i' } },
                ];
            }

            let sort = {};
            if (req.query.sortBy) {
                sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
            }

            const list = await User.find(query)
                .sort(sort)
                .skip(skip)
                .limit(perPage);
            
            const total = await User.countDocuments(query);
            const totalPages = Math.ceil(total / perPage);

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    {
                        user: list,
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
     * This function will remove user profile
     * 
     * @param {string} req.params.id -The id of the user
     * @returns Delete user detail by id
     */
    removeUser: async function (req, res) {
        try {
            if (services.hashValidatorErrors(req, res)) {
                return;
            }
    
            const userId = req.params.id;
    
            // Soft delete by updating `isDeleted` to true
            const deleteUser = await User.findOneAndUpdate(
                { _id: userId, isDeleted: false },
                { $set: { isDeleted: true } },
                { new: true }
            );
    
            if (!deleteUser) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.USER_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.NO_CONTENT,
                    Msg.USER_PROFILE_DELETE
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