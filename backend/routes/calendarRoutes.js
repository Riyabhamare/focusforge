const express = require('express');
const { body } = require('express-validator');
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/month', calendarController.getMonthView);
router.get('/events', calendarController.getEvents);

router.post(
  '/events',
  [
    body('title').trim().notEmpty().withMessage('Event title is required'),
    body('date').isISO8601().withMessage('Valid date YYYY-MM-DD required'),
    validateMiddleware
  ],
  calendarController.createEvent
);

router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

module.exports = router;
