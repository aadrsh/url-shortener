const qr = require("qrcode");
const requestIp = require("request-ip");
const { recordClick } = require("./clickController");
const { PrismaClient } = require('@prisma/client');
const { doesShortCodeExist } = require("../controllers/linkController");
const { isShortCodeInvalid } = require("../utils/validators");


const prisma = new PrismaClient();

const WEB_SERVER_URL = process.env.WEB_SERVER_URL || "http://localhost:3000";
const REDIRECT_SERVER_URL = process.env.REDIRECT_SERVER_URL || "http://localhost:3001";


const getExternalLink = async (req, res) => {
  console.log("getExternalLink Called");
  try {
    const { shortcode } = req.params;
    const link = await prisma.link.findFirst({ where: { shortUrl: shortcode } });
    console.log("Shortlink",shortcode,"Link:", link);
    if (link) {
      recordClick(link.id, requestIp.getClientIp(req), req.useragent.platform, req.useragent.browser);
      res.redirect(link.originalUrl);
    } else {
      res.status(404).redirect(WEB_SERVER_URL + "/404.html?reason=Code-Not-Found");
    }
  } catch (error) {
    console.error("Database or server error:", error);
    res.status(500).send("Server error");
  }
};

const getQRCode = async (req, res) => {
  console.log("getQRCode Called");
  const { shortcode } = req.params;

  // Validate shortcode
  if (isShortCodeInvalid(shortcode)) {
    return res.redirect(WEB_SERVER_URL + "/404.html?reason=Invalid-Text-Code");
  }
  
  if(!await doesShortCodeExist(shortcode)){
    return res.redirect(WEB_SERVER_URL + "/404.html?reason=Code-Not-Found");
  }

  try {
    // Generate QR code for the long URL
    qr.toDataURL(REDIRECT_SERVER_URL + '/' + shortcode, (err, qrUrl) => {
      if (err) {
        res.redirect(WEB_SERVER_URL + "/404.html?reason=QR-Generation-Error");
      } else {
        // Return the QR code image
        res.send(`
            <link rel="icon" type="image/x-icon" href="http://localhost:3000/favicon.ico"> 
          <img src="${qrUrl}" alt="QR Code"/>`);
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("Unexpected error occurred");
  }
}

const invalid = (req, res) => {
  res.redirect(WEB_SERVER_URL + "/brokenlink");
};

module.exports = {
  getExternalLink,
  getQRCode,
  invalid
};
