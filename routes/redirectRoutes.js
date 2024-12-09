const express = require("express");
const router = express.Router();
const { getExternalLink,getQRCode,invalid } = require("../controllers/redirectController");

router.get("/:shortcode.qr",getQRCode);
router.get("/:shortcode", getExternalLink);
router.get("/*",invalid);
module.exports = router;
