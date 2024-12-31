"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../controllers/auth/authController");
const Msg = require("../../helpers/localization");
const { body } = require("express-validator");
const { authenticateAnyUser } = require("../../helpers/middleware");

/**
 * This route handle user signup
 */
router.post(
    "/signUp",
    body("type")
        .notEmpty()
        .withMessage(Msg.TYPE_REQUIRED),
    body("firstName")
        .notEmpty()
        .withMessage(Msg.FIRST_NAME_REQUIRED)
        .isAlpha()
        .withMessage(Msg.INVALID_NAME),
    body("lastName")
        .notEmpty()
        .withMessage(Msg.LAST_NAME_REQUIRED)
        .isAlpha()
        .withMessage(Msg.INVALID_NAME),
    body("email")
        .notEmpty()
        .withMessage(Msg.EMAIL_REQUIRED)
        .isEmail()
        .withMessage(Msg.INVALID_EMAIL),
    body("password")
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
        .notEmpty()
        .withMessage(Msg.MOBILE_NUMBER_REQUIRED)
        .isNumeric()
        .withMessage(Msg.INVALID_INPUT)
        .isLength({ min: 10, max: 10 })
        .withMessage(Msg.INVALID_MOBILE_NUMBER),
    body("dateOfBirth")
        .notEmpty()
        .withMessage(Msg.DATE_OF_BIRTH_REQUIRED),
    body("gender")
        .notEmpty()
        .withMessage(Msg.GENDER_REQUIRED),
    controller.signUp
);

/**
 * This route handle user login
 */
router.post(
    "/login",
    body("email")
        .notEmpty()
        .withMessage(Msg.EMAIL_REQUIRED)
        .isEmail()
        .withMessage(Msg.INVALID_EMAIL),
    body("password")
        .notEmpty()
        .withMessage(Msg.PASSWORD_REQUIRED)
        .isLength({ min: 6 })
        .withMessage(Msg.INVALID_PASSWORD),
    controller.login
);

/**
 * This route update the user password
 */
router.put(
    "/update/password",authenticateAnyUser,
    body("currentPassword")
        .notEmpty()
        .withMessage(Msg.PASSWORD_REQUIRED)
        .isLength({ min: 6 })
        .withMessage(Msg.INVALID_PASSWORD),
    body("newPassword")
        .notEmpty()
        .withMessage(Msg.PASSWORD_REQUIRED)
        .isLength({ min: 6 })
        .withMessage(Msg.INVALID_PASSWORD),
    controller.updatePassword
);

/**
 * This route handle the forgot password process
 */
router.post(
    "/forgot/password",authenticateAnyUser,
    body("email")
        .notEmpty()
        .withMessage(Msg.EMAIL_REQUIRED)
        .isEmail()
        .withMessage(Msg.INVALID_EMAIL),
    controller.forgotPassword
);

/**
 * This route delete the user profile
 */
router.delete(
    "/logout",authenticateAnyUser,
    controller.logout
);

module.exports = router;