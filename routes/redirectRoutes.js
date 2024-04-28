const express = require('express');
const router = express.Router();
const { getExternalLink } = require('../controllers/redirectController');

router.get('/:shortcode', getExternalLink);

module.exports = router;
