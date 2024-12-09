const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const recordClick = async (linkId, ipAddress, platform, userAgent) => {
  try {
    const click = await prisma.click.create({
      data: {
        linkId,
        ipAddress,
        platform,
        userAgent
      },
    });
    return click;
  } catch (error) {
    throw error;
  }
};

const getClicks = async (req, res) => {
  const { linkId } = req.params;
  try {
    const clicks = await prisma.click.findMany({
      where: { linkId },
      include: { Link: true },
    });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClicksByPlatform = async (req,res) => {
  try {
    const result = await prisma.click.groupBy({
      by: ['platform'],
      _count: {
        platform: true,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClicksByTimePeriod = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m-%d %H', clickedAt) as period, 
        COUNT(*) as clickCount 
      FROM Click 
      GROUP BY period
      ORDER BY period;
    `;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopLinks = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    const result = await prisma.click.groupBy({
      by: ['linkId'],
      _count: {
        linkId: true,
      },
      orderBy: {
        _count: {
          linkId: 'desc',
        },
      },
      take: limit,
    });
    const enrichedResult = await Promise.all(
      result.map(async (item) => {
        const link = await prisma.link.findUnique({
          where: { id: item.linkId },
        });
        return { ...link, clickCount: item._count.linkId };
      })
    );
    res.json(enrichedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPeakClickPeriods = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m-%d %H', clickedAt) as period, 
        COUNT(*) as clickCount 
      FROM Click 
      GROUP BY period
      ORDER BY clickCount DESC
      LIMIT ${limit};
    `;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserLinkClicks = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await prisma.click.findMany({
      where: {
        link: {
          createdById: parseInt(userId),
        },
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  recordClick,
  getClicks,
  getClicksByPlatform,
  getClicksByTimePeriod,
  getTopLinks,
  getPeakClickPeriods,
  getUserLinkClicks,
};
