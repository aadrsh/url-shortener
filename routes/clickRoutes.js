const express = require("express");
const router = express.Router();
const { recordClick, getClicks } = require("../controllers/clickController");

router.get("/:linkId", getClicks);

module.exports = router;
