const express = require('express');
const { body } = require('express-validator');
const {
  getAllBooks,
  getAvailableBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/available', getAvailableBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// Admin only routes
router.post(
  '/',
  auth,
  roleCheck('Administrator'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('ISBN').trim().notEmpty().withMessage('ISBN is required'),
    body('course').isMongoId().withMessage('Valid course ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  createBook
);

router.put(
  '/:id',
  auth,
  roleCheck('Administrator'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
    body('ISBN').optional().trim().notEmpty().withMessage('ISBN cannot be empty'),
    body('course').optional().isMongoId().withMessage('Valid course ID is required'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be at least 0'),
  ],
  updateBook
);

router.delete('/:id', auth, roleCheck('Administrator'), deleteBook);

module.exports = router;
