"use strict";

const CouponModel = require("../../models/coupon");
const services = require("../../helpers/index");
const Msg = require("../../helpers/localization");
const { HttpStatus } = require("../../errors/code");

module.exports = {
    /**
     * This function will create a new coupon with the provided information
     * 
     * @param {string} req.body.code -The code of the coupon
     * @param {string} req.body.description -The description of the coupon
     * @param {number} req.body.discount -The amount of discount
     * @param {string} req.body.expiryDate -The expiry date of the coupon
     * @param {number} req.body.maxUses -The maximum number of uses for the coupon
     * @param {number} req.body.usedCount -The count of how many times the coupon has been used
     * @returns Create coupon and return new coupon id
     */
    addCoupon: async function (req,res) {
        try {
            if (services.hashValidatorErrors(req,res)) {
                return;
            }

            const existingCoupon = await CouponModel.findOne({ code: req.body.code });
            if (existingCoupon) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.CONFLICT,
                        Msg.COUPON_CODE_ALREADY_EXIST
                    )
                )
            }
            
            const couponDetail = {
                code: req.body.code,
                description: req.body.description,
                discount: req.body.discount,
                expiryDate: req.body.expiryDate,
                maxUses: req.body.maxUses,
                usedCount: req.body.usedCount,
            };
            
            const newCoupon = await CouponModel.create(couponDetail);
            return res.send(
                services.prepareResponse(
                    HttpStatus.CREATED,
                    Msg.COUPON_CREATED,
                    { id: newCoupon.id }
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