"use strict";

const express = require("express");
const router = express.Router();

router.use(require("./userRoute"));
router.use(require("./categoryRoute"));

module.exports = router;
