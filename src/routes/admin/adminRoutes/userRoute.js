"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/admin/userController");
const Msg = require("../../../helpers/localization");
const { param,query } = require("express-validator");

/**
 * This route list all user
 */
router.get(
    "/list/user",
        query("search").optional().isString(),
        query("page").optional().isInt(),
        query("perPage").optional().isInt(),
    controller.listUser
);

/**
 * This route remove a specific user
 */
router.delete(
    "/remove/user/:id",
    param("id")
        .isMongoId()
        .withMessage(Msg.INVALID_USER_ID),
    controller.removeUser
);

module.exports = router;