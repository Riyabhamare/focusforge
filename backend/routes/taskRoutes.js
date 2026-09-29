const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    validateMiddleware
  ],
  taskController.createTask
);

router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/complete', taskController.completeTask);
router.post('/:id/complete', taskController.completeTask);

module.exports = router;
