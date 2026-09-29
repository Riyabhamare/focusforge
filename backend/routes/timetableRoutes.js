const express = require('express');
const { body } = require('express-validator');
const timetableController = require('../controllers/timetableController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', timetableController.getWeek);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('day_of_week').isInt({ min: 0, max: 6 }).withMessage('day_of_week must be an integer from 0 (Sun) to 6 (Sat)'),
    body('start_time').notEmpty().withMessage('start_time is required'),
    body('end_time').notEmpty().withMessage('end_time is required'),
    validateMiddleware
  ],
  timetableController.createBlock
);

router.put('/:id', timetableController.updateBlock);
router.delete('/:id', timetableController.deleteBlock);

module.exports = router;
