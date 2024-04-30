const { Click, Link } = require("../models");

const recordClick = async (linkId, ipAddress, platform) => {
  const clickedAt = new Date();
  try {
    const click = await Click.create({
      linkId,
      clickedAt,
      ipAddress,
      platform,
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
