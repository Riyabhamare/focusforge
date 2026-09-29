const express = require('express');
const { body } = require('express-validator');
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoalById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Goal title is required'),
    validateMiddleware
  ],
  goalController.createGoal
);

router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.patch('/:id/complete', goalController.completeGoal);
router.patch(
  '/:id/progress',
  [
    body('progress_percent').isInt({ min: 0, max: 100 }).withMessage('progress_percent must be an integer between 0 and 100'),
    validateMiddleware
  ],
  goalController.updateProgress
);

module.exports = router;
