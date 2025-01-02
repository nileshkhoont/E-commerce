"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/user/categoryController");
const { query } = require("express-validator");
const { authenticateUser } = require("../../../helpers/middleware");

/**
 * This route list all category
 */
router.get(
    "/list/category",authenticateUser,
        query("search").optional().isString(),
        query("page").optional().toInt(),
        query("perPage").optional().toInt(),
    controller.listCategory
);

module.exports = router;