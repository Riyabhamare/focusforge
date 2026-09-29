const express = require('express');
const { body } = require('express-validator');
const habitController = require('../controllers/habitController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', habitController.getHabits);
router.get('/:id', habitController.getHabitById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Habit title is required'),
    validateMiddleware
  ],
  habitController.createHabit
);

router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);

router.post(
  '/:id/log',
  [
    body('date').optional().isISO8601().withMessage('Valid date format YYYY-MM-DD required'),
    validateMiddleware
  ],
  habitController.logCompletion
);

module.exports = router;
