"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/seller/couponController");
const Msg = require("../../../helpers/localization");
const { body } = require("express-validator");
const { authenticateSeller } = require("../../../helpers/middleware");

/**
 * This route adds a new coupon
 */
router.post(
    "/add/coupon", authenticateSeller,
    body("code")
        .notEmpty()
        .withMessage(Msg.COUPON_CODE_REQUIRED),
    body("description")
        .notEmpty()
        .withMessage(Msg.COUPON_DESCRIPTION_REQUIRED),
    body("discount")
        .notEmpty()
        .withMessage(Msg.DISCOUNT_AMOUNT_REQUIRED),
    body("expiryDate")
        .notEmpty()
        .withMessage(Msg.EXPIRY_DATE_REQUIRED),
    body("maxUses")
        .notEmpty()
        .withMessage(Msg.INVALID_MAX_USES),
    body("minOrderValue")
        .optional()
        .isNumeric()
        .withMessage(Msg.INVALID_MIN_ORDER_VALUE),
    body("categoriesApplicable")
        .optional()
        .isArray()
        .withMessage(Msg.INVALID_CATEGORIES),
    controller.addCoupon
);

module.exports = router;
