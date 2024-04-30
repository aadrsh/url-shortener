const express = require('express');
const router = express.Router();
const { getExternalLink } = require('../controllers/redirectController');

router.get('/:shortcode.qr',(req,res)=>{
    res.send({qr:'done'});
});

router.get('/:shortcode', getExternalLink);


module.exports = router;
