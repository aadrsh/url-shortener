const express = require("express");
const router = express.Router();
const {
    getClicks,
    getClicksByPlatform,
    getClicksByTimePeriod,
    getTopLinks,
    getPeakClickPeriods,
    getUserLinkClicks
} = require("../controllers/clickController");

router.get("/:linkId", getClicks);
router.get("/platform/stats", getClicksByPlatform);
router.get("/time/stats", getClicksByTimePeriod);
router.get("/top/links", getTopLinks);
router.get("/peak/periods", getPeakClickPeriods);
router.get("/user/:userId", getUserLinkClicks);

module.exports = router;
