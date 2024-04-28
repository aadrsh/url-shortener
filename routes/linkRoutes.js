const express = require('express');
const router = express.Router();
const { createLink, getLink, updateLink, deleteLink, getAllLinks } = require('../controllers/linkController');

router.post('/', createLink);
router.get('/:id', getLink);
router.get('/', getAllLinks);  // Fetch all links
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);

module.exports = router;
