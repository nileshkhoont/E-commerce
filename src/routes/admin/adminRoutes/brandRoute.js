"use strict";

const express = require("express")
const router = express.Router();
const controller = require("../../../controllers/admin/brandController");
const Msg = require("../../../helpers/localization");
const { body,param,query } = require("express-validator");
const { authenticateAdmin } = require("../../../helpers/middleware");

/**
 * This route is for adding a brand
 */
router.post(
    "/add/brand",authenticateAdmin,
    body("name")
        .notEmpty()
        .withMessage(Msg.BRAND_NAME_REQUIRED)
        .isString()
        .withMessage(Msg.INVALID_NAME),
    controller.addBrand
);

/**
 * This route is for listing all brand
 */
router.get(
    "/list/brand",authenticateAdmin,
        query("search").optional().isString(),
        query("page").optional().toInt(),
        query("perPage").optional().toInt(),
    controller.listBrand
);

/**
 * This route update the detail of an existing brand
 */
router.put(
    "/update/brand/:id",authenticateAdmin,
    param("id")
        .isMongoId()
        .withMessage(Msg.INVALID_BRAND_ID),
    body("name")
        .optional()
        .notEmpty()
        .withMessage(Msg.BRAND_NAME_REQUIRED)
        .isString()
        .withMessage(Msg.INVALID_NAME),
    controller.updateBrand
);

/**
 * This route delete a specific brand
 */
router.delete(
    "/delete/brand/:id",authenticateAdmin,
    param("id")
        .isMongoId()
        .withMessage(Msg.INVALID_BRAND_ID),
    controller.deleteBrand
);

module.exports = router;