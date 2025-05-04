const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

router.post('/click', actionController.click);
router.post('/fill', actionController.fill);
router.post('/hover', actionController.hover);
router.post('/goto', actionController.goto);
router.post('/type', actionController.type);
router.post('/press', actionController.press);
router.post('/check', actionController.check);
router.post('/select', actionController.select);
router.post('/upload', actionController.upload);
router.post('/focus', actionController.focus);
router.post('/drag', actionController.drag);
router.post('/debug', actionController.debug);

module.exports = router; 