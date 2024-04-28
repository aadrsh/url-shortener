const { Link } = require("../models");

const getExternalLink = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const link = await Link.findOne({ where: { shortenedUrl: shortcode } });
    if (link) {
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
