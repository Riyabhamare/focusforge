const express = require('express');
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Note title is required'),
    validateMiddleware
  ],
  noteController.createNote
);

router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
