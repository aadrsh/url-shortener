const express = require("express");
const router = express.Router();
const { getExternalLink,getQRCode,invalid,home } = require("../controllers/redirectController");

router.get("/:shortcode.qr",getQRCode);
router.get("/:shortcode", getExternalLink);
router.get("/",home);
router.get("/*",invalid);
module.exports = router;
