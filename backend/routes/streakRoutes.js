const express = require('express');
const streakController = require('../controllers/streakController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', streakController.getStreak);

module.exports = router;
