const express = require("express");
const qr = require("qrcode");

const router = express.Router();
const { getExternalLink } = require("../controllers/redirectController");

router.get("/:shortcode.qr", (req, res) => {
  const { shortcode } = req.params;
  // Generate QR code for the long URL
  qr.toDataURL("https://codedar.win/" + shortcode, (err, qrUrl) => {
    if (err) {
      console.error("Error generating QR code:", err);
      res.status(500).send("Error generating QR code");
    } else {
      // Return the QR code image
      res.send(`<img src="${qrUrl}" alt="QR Code"/>`);
    }
  });
});

router.get("/:shortcode", getExternalLink);

module.exports = router;
