"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/user/userController");
const Msg = require("../../../helpers/localization");
const { body } = require("express-validator");
const { authenticateUser } = require("../../../helpers/middleware");

/**
 * This route retrieve the user profile
 */
router.get(
    "/profile",authenticateUser,
    controller.getMyProfile
);

/**
 * This route update the user profile
 */
router.put(
    "/update/profile",authenticateUser,
    body("firstName")
        .optional()
        .notEmpty()
        .withMessage(Msg.FIRST_NAME_REQUIRED),
    body("lastName")
        .optional()
        .notEmpty()
        .withMessage(Msg.LAST_NAME_REQUIRED),
    body("email")
        .optional()
        .notEmpty()
        .withMessage(Msg.EMAIL_REQUIRED)
        .isEmail()
        .withMessage(Msg.INVALID_EMAIL),
    body("password")
        .optional()
        .notEmpty()
        .withMessage(Msg.PASSWORD_REQUIRED)
        .matches(/[A-Z]/)
        .withMessage(Msg.REQUIRED_UPPERCASE)
        .matches(/[a-z]/)
        .withMessage(Msg.REQUIRED_LOWERCASE)
        .matches(/[0-9]/)
        .withMessage(Msg.REQUIRED_DIGIT)
        .matches(/[@$!%*?&#]/)
        .withMessage(Msg.REQUIRED_SPECIAL_CHARACTER)
        .isLength({ min: 8, max: 12 })
        .withMessage(Msg.INVALID_PASSWORD_LENGTH),
    body("mobileNumber")
        .optional()
        .notEmpty()
        .withMessage(Msg.MOBILE_NUMBER_REQUIRED)
        .isNumeric()
        .withMessage(Msg.INVALID_INPUT)
        .isLength({ min: 10, max: 10 })
        .withMessage(Msg.INVALID_MOBILE_NUMBER),
    body("dateOfBirth")
        .optional()
        .notEmpty()
        .withMessage(Msg.DATE_OF_BIRTH_REQUIRED),
    body("gender")
        .optional()
        .notEmpty()
        .withMessage(Msg.INVALID_GENDER),
    controller.updateUser
);

module.exports = router;