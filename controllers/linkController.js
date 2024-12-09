const { PrismaClient,Prisma } = require('@prisma/client');
const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

const { urlValidator,isShortCodeInvalid } = require("../utils/validators");

const REDIRECT_SERVER_URL = process.env.REDIRECT_SERVER_URL || "http://localhost:3001";

const generateShortCode = require("../utils/shortCodeGenerator"); // Import the utility function

const createLink = async (req, res) => {
  const { originalUrl, shortUrl, alias } = req.body;

  //Validating the URL
  const urlResult = urlValidator(originalUrl);
  if (!urlResult.success) {
    return res.status(urlResult.code).json({ error: urlResult.message });
  }

  console.log("Short URL:", isShortCodeInvalid(shortUrl));

  if(isShortCodeInvalid(shortUrl)){
    return res.status(400).json({ error: "Invalid Short URL." });
  }

  try {
    const { success, code, message } = await generateShortCode(shortUrl);
    if (!success) {
      console.error("Error in generateShortCode:", message);
      return res.status(409).json({ error: message }); // 409 Conflict is often used for duplicate resource
    }
    const link = await prisma.link.create({data:{ originalUrl, shortUrl: code, alias,createdById: req.user.id }});
    res.json(link);
  }catch (error) {
    console.error("Error in createLink:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const linkId = parseInt(id, 10);
    const { originalUrl, shortUrl, alias } = req.body;

    const link = await prisma.link.findFirst({ where: { id: linkId } });
    if(link.createdById !== req.user.id && req.user.role !== 'admin'){
      return res.status(403).json({ error: "You are not authorized to update this link." });
    }

    //Validating the URL
    const urlResult = urlValidator(originalUrl);
    if (!urlResult.success) {
      return res.status(urlResult.code).json({ error: urlResult.message });
    }

    if(isShortCodeInvalid(shortUrl)){
      return res.status(400).json({ error: "Invalid Short URL." });
    }

    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: { originalUrl, shortUrl, alias },
    });

    res.json(updatedLink);
  } catch (e) {
    if(e instanceof Prisma.PrismaClientKnownRequestError)
      {
        if(e.code === 'P2002')
          res.status(500).json({ error: "The Shortcode Already Exist" });
        if(e.code === 'P2025')
          res.status(500).json({ error: "The Link does not exists" });
      }else{
        res.status(500).json({ error: "Internal Server Error" });
      }
  }
};


const deleteLink = async (req, res) => {
  const { id } = req.params;
  const linkId = parseInt(id, 10);
  try {

    const link = await prisma.link.findFirst({ where: { id: linkId } });
    if(link.createdById !== req.user.id && req.user.role !== 'admin'){
      return res.status(403).json({ error: "You are not authorized to delete this link." });
    }

    const deletedLink = await prisma.link.delete({ where: { id: linkId } });
    
    res.json({ message: "Link deleted" });
  } catch (error) {
    if(e instanceof Prisma.PrismaClientKnownRequestError)
      {
        if(e.code === 'P2025')
          res.status(500).json({ error: "The Link does not exists" });
      }else{
        res.status(500).json({ error: "Internal Server Error" });
      }
  }
};


//restrict to admin only
const getAllLinks = async (req, res) => {
  const {id} = req.params;
  try{
    const links = await prisma.link.findMany({
      select: {
      id: true,
      originalUrl: true,
      shortUrl: true,
      alias: true,
      _count: {
        select: { clicks: true }, // Aggregate function to count Clicks
        },
      },
      orderBy: {
      createdAt: 'desc', // Sorting links by updatedAt in descending order
      },
    });
    // Converting to JSON might be necessary to properly see the results
    const result = {'redirectServerUrl': REDIRECT_SERVER_URL, 'links': links};
    res.json(result);
  } catch (error) {
    console.error("Error in getAllLinks:", error);
    res.status(500).json({ error: error.message });
  }
};

//this will return the links created by the user
const getMyLinks = async (req, res) => {
  try{
    const links = await prisma.link.findMany({
      where: { createdById: req.user.id },
      select: {
      id: true,
      originalUrl: true,
      shortUrl: true,
      alias: true,
      _count: {
        select: { clicks: true }, // Aggregate function to count Clicks
      },
      },
      orderBy: {
      createdAt: 'desc', // Sorting links by updatedAt in descending order
      },
    });
    // Converting to JSON might be necessary to properly see the results
    const result = {'redirectServerUrl': REDIRECT_SERVER_URL, 'links': links};
    res.json(result);
  } catch (error) {
    console.error("Error in getAllLinks:", error);
    res.status(500).json({ error: error.message });
  }
};

//this will be used by admin only
const getLinksById = async (req, res) => {
  console.log("getLinksById invoked");
  const {id} = req.params;

  // Check if the 'id' exists and is a valid number (using a regular expression for numeric validation)
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid User ID, must be a number." });
  }
  
  const userId = parseInt(id, 10);

  if(userId !== req.user.id && req.user.role !== 'admin'){
    return res.status(403).json({ error: "You are not authorized to access this link." });
  }

  try{
    const links = await prisma.link.findMany({
      where: { createdById: userId },
      select: {
      id: true,
      originalUrl: true,
      shortUrl: true,
      alias: true,
      _count: {
        select: { clicks: true }, // Aggregate function to count Clicks
      },
      },
      orderBy: {
      createdAt: 'desc', // Sorting links by updatedAt in descending order
      },
    });
    // Converting to JSON might be necessary to properly see the results
    const result = {'redirectServerUrl': REDIRECT_SERVER_URL, 'links': links};
    res.json(result);
  } catch (error) {
    console.error("Error in getAllLinks:", error);
    res.status(500).json({ error: error.message });
  }
};

const doesShortCodeExist = async (shortUrl) => {
  const link = await prisma.link.findFirst({ where: { shortUrl: shortUrl } });
  return !!link;
};

module.exports = {
  createLink,
  updateLink,
  deleteLink,
  getAllLinks,
  getMyLinks,
  getLinksById,
  doesShortCodeExist,
};
