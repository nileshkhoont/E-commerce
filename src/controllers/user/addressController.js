"use strict";

const AddressModel = require("../../models/address");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");

module.exports = {
    /**
     * This function will create a new user address with the provided information
     * 
     * @param {string} req.body.apartmentName -The apartment name
     * @param {string} req.body.streetNo -The street number
     * @param {string} req.body.city -The city
     * @param {string} req.body.state -The state
     * @param {string} req.body.pinCode -The pin code
     * @param {string} req.body.country -The country
     * @returns User address create and return new address id
     */
    addAddress: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const userId = req.authUser.id;
            const addressDetail = {
                userId: userId,
                apartmentName: req.body.apartmentName,
                streetNo: req.body.streetNo,
                city: req.body.city,
                state: req.body.state,
                pinCode: req.body.pinCode,
                country: req.body.country,
            };
            
            const newAddress = await AddressModel.create(addressDetail);
            return res.send(
                services.prepareResponse(
                    HttpStatus.CREATED,
                    Msg.USER_ADDRESS_CREATED,
                    { id: newAddress.id }
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
     * This function will list of all user address
     * 
     * @param {string} req.query.search -The search term
     * @param {number} req.query.page -The page number
     * @param {number} req.query.perPage -The number of record per page
     * @returns Return all user List
     */
    listAddress: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const userId = req.authUser._id;
            const { perPage, page, skip } = services.parsePagination(req.query);
            let query = { userId: userId };

            if (req.query.search) {
                query.$or = [
                    { city: { $regex: req.query.search, $options: 'i' } },
                    { state: { $regex: req.query.search, $options: 'i' } },
                ];
            }

            const total = await AddressModel.countDocuments(query);
            const list = await AddressModel.find(query)
                .skip(skip)
                .limit(perPage)
                .populate("userId", "firstName lastName mobileNumber -_id");

            const totalPages = Math.ceil(total / perPage);

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    {
                        address: list,
                        page: page + 1,
                        perPage: perPage,
                        totalRecords: total,
                        totalPages: totalPages
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
     * This function will detail of user address by id 
     * 
     * @param {string} req.params.id -The user address id
     * @return Return user address by id
     */
    addressDetail: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const addressId = req.params.id;

            const address = await AddressModel.findById(addressId);
            if (!address) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.USER_ADDRESS_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.SUCCESS,
                    { address }
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
     * This function will update address with the provided information
     * 
     * @param {string} req.params.id -The id of the address
     * @param {string} req.body.userId -The id of the user
     * @param {string} req.body.apartment -The apartment name
     * @param {string} req.body.street -The street number
     * @param {string} req.body.city -The city
     * @param {string} req.body.state -The state
     * @param {string} req.body.zipCode -The zip code
     * @param {string} req.body.country -The country
     * @returns Update the address detail and return new address id
     */
    updateAddress: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }
            
            const addressId = req.params.id;

            const address = await AddressModel.findById(addressId);
            if (!address) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.USER_ADDRESS_NOT_FOUND
                    )
                );
            }
            
            const addressDetail = {
                userId: req.body.userId,
                apartmentName: req.body.apartmentName,
                streetNo: req.body.streetNo,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                country: req.body.country,
            };

            const updatedAddress = await AddressModel.findByIdAndUpdate(
                addressId,
                addressDetail,
                { new: true }
            );

            return res.send(
                services.prepareResponse(
                    HttpStatus.OK,
                    Msg.USER_ADDRESS_UPDATED,
                    { id: updatedAddress.id }
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
     * This function will delete a user address
     * 
     * @param {string} req.params.id -The id of the address
     * @returns Delete user address by id
     */
    deleteAddress: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }
            
            const addressId = req.params.id;

            const addressInfo = await AddressModel.findByIdAndDelete(addressId);
            if (!addressInfo) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND,
                        Msg.USER_ADDRESS_NOT_FOUND
                    )
                );
            }
            return res.send(
                services.prepareResponse(
                    HttpStatus.NO_CONTENT,
                    Msg.USER_ADDRESS_DELETED
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
    }
}