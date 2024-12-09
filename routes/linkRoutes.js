const express = require('express');
const router = express.Router();
const { 
    createLink,
    updateLink,
    deleteLink,
    getAllLinks,
    getMyLinks,
    getLinksById,
 } = require('../controllers/linkController');

const {authMiddleware,roleMiddleware} = require('../middlewares');

router.post('/', createLink);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);
router.get('/',roleMiddleware("admin"),getAllLinks);  // Fetch all links
router.get('/mylinks',getMyLinks);  // Fetch all links created by the user
router.get('/:id',roleMiddleware("admin"), getLinksById);

module.exports = router;
