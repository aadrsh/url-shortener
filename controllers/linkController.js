const { Link } = require("../models");

const generateShortCode = require("../utils/shortCodeGenerator"); // Import the utility function

const createLink = async (req, res) => {
  const { originalUrl, alias, shortenedUrl } = req.body;
  try {
    const { success, code, message } = await generateShortCode(shortenedUrl);
    if (!success) {
      return res.status(409).json({ error: message }); // 409 Conflict is often used for duplicate resource
    }
    const link = await Link.create({ originalUrl, shortenedUrl: code, alias });
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLink = async (req, res) => {
  const { id } = req.params;
  try {
    const link = await Link.findByPk(id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLink = async (req, res) => {
  const { id } = req.params;
  const { originalUrl, shortenedUrl, alias } = req.body;

  try {
    const link = await Link.findByPk(id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Generate or validate the new shortened URL
    const { success, code, message } = await generateShortCode(shortenedUrl);
    if (!success) {
      return res.status(409).json({ error: message }); // Conflict if the new shortened URL is already in use
    }

    // Update the link with new values
    link.originalUrl = originalUrl;
    link.shortenedUrl = code; // Use the new or validated code
    link.alias = alias;
    await link.save();
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLink = async (req, res) => {
  const { id } = req.params;
  try {
    const link = await Link.findByPk(id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    link.shortenedUrl = link.shortenedUrl + "_" + link.id;
    await link.save();
    await link.destroy();
    res.json({ message: "Link deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLinks = async (req, res) => {
  try {
    console.log("getAllLinks called");
    const links = await Link.findAll({ order: [["updatedAt", "DESC"]] });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLink,
  getLink,
  updateLink,
  deleteLink,
  getAllLinks,
};
