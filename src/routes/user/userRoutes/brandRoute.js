"use strict";

const express = require("express")
const router = express.Router();
const controller = require("../../../controllers/user/brandController");
const { query } = require("express-validator");
const { authenticateUser } = require("../../../helpers/middleware");

/**
 * This route is for listing all brand
 */
router.get(
    "/list/brand",authenticateUser,
        query("search").optional().isString(),
        query("page").optional().toInt(),
        query("perPage").optional().toInt(),
    controller.listBrand
);

module.exports = router;