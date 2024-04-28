const { Click, Link } = require("../models");

const recordClick = async () => {
  const { linkId } = req.params; // Get link ID from route parameters
  const headerDetails = req.headers; // Collect some header info (or more specific if needed)

  try {
    const click = await Click.create({
      linkId,
      headerDetails,
    });
    return click;
  } catch (error) {
    throw error;
  }
};

const getClicks = async (req, res) => {
  const { linkId } = req.params;
  try {
    const clicks = await Click.findAll({
      where: { linkId },
      include: [Link],
    });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  recordClick,
  getClicks,
};
