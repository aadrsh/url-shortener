const REDIRECT_SERVER_URL = process.env.REDIRECT_SERVER_URL || "http://localhost:3001";


const isShortCodeInvalid = (shortcode) => {
    if(shortcode==null || shortcode.length==0) return false;
    return (!shortcode || typeof shortcode !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(shortcode) || shortcode.length > 10);
}


const urlValidator = (originalUrl) => {
  const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;

  if (!urlPattern.test(originalUrl)) {
    return {success: false, code:400, message: "Invalid URL. Only HTTPS URLs are allowed."};
  }

  if (originalUrl.includes(REDIRECT_SERVER_URL)) {
    return {success: false, code:400, message: "Original URL cannot contain the redirect server URL."};
  }
  return {success: true, code:200, message: "URL is valid"};
}

module.exports = {isShortCodeInvalid,urlValidator};