const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/start', sessionController.startSession);
router.post('/close', sessionController.closeSession);

module.exports = router; 