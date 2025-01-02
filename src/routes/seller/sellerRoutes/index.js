"use strict";

const express = require("express");
const router = express.Router();

router.use(require("./productRoute"));
router.use(require("./couponRoute"));

module.exports = router;
