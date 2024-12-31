"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/admin/categoryController");
const Msg = require("../../../helpers/localization");
const { body,param,query } = require("express-validator");
const { authenticateAdmin } = require("../../../helpers/middleware")

/**
 * This route add a new category
 */
router.post(
    "/add/category",authenticateAdmin,
    body("name")
        .notEmpty()
        .withMessage(Msg.CATEGORY_NAME_REQUIRED)
        .isString()
        .withMessage(Msg.INVALID_NAME),
    controller.addCategory
);

/**
 * This route list all category
 */
router.get(
    "/list/category",authenticateAdmin,
        query("search").optional().isString(),
        query("page").optional().toInt(),
        query("perPage").optional().toInt(),
    controller.listCategory
);

/**
 * This route update the detail of an existing category
 */
router.put(
    "/update/category/:id",
    param("id")
        .isMongoId()
        .withMessage(Msg.INVALID_CATEGORY_ID),
    body("name")
        .optional()
        .notEmpty()
        .withMessage(Msg.CATEGORY_NAME_REQUIRED)
        .isString()
        .withMessage(Msg.INVALID_NAME),
    controller.updateCategory
);

module.exports = router;