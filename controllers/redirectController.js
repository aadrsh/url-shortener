const { Link } = require("../models");
const { recordClick } = require("./clickController");
const requestIp = require("request-ip");

const getExternalLink = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const link = await Link.findOne({ where: { shortenedUrl: shortcode } });
    if (link) {
      recordClick(link.id, requestIp.getClientIp(req), req.useragent.platform);
      res.redirect(link.originalUrl);
    } else {
      res.status(404).redirect("/404.html");
    }
  } catch (error) {
    console.error("Database or server error:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getExternalLink,
};
