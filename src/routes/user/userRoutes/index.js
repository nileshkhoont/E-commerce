"use strict";

const express = require("express");
const router = express.Router();

router.use(require("./userRoute"));
router.use(require("./addressRoute"));
router.use(require("./categoryRoute"));
router.use(require("./subCategoryRoute"));
router.use(require("./brandRoute"));
router.use(require("./productRoute"));
router.use(require("./wishlistRoute"));

module.exports = router;
