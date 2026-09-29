const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/daily', analyticsController.getDaily);
router.get('/weekly', analyticsController.getWeekly);
router.get('/monthly', analyticsController.getMonthly);
router.get('/categories', analyticsController.getCategoryDistribution);
router.get('/heatmap', analyticsController.getHeatmap);

module.exports = router;
