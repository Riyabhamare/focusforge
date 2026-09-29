const express = require('express');
const { body } = require('express-validator');
const pomodoroController = require('../controllers/pomodoroController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/sessions',
  [
    body('duration_minutes').isInt({ min: 1 }).withMessage('duration_minutes must be an integer >= 1'),
    validateMiddleware
  ],
  pomodoroController.logSession
);

router.get('/sessions', pomodoroController.getHistory);

module.exports = router;
