const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', userController.getProfile);
router.get('/profile', userController.getProfile);
router.get('/xp-history', userController.getXpHistory);
router.get('/stats', userController.getStats);
router.put('/settings', userController.updateSettings);

module.exports = router;
