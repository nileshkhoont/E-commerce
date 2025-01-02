"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/user/subCategoryController");
const { query } = require("express-validator");
const { authenticateUser } = require("../../../helpers/middleware");

/**
 * This route list all subcategory
 */
router.get(
    "/list/subcategory",authenticateUser,
        query("search").optional().isString(),
        query("page").optional().toInt(),
        query("perPage").optional().toInt(),
    controller.listSubCategory
);


module.exports = router;