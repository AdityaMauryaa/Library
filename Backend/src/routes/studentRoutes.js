const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentBorrowedBooks
} = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Validation middleware
const updateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

// Public routes - None (all student routes require authentication)

// Protected routes - Admin only
router.get('/', auth, roleCheck('Administrator'), getAllStudents);
router.get('/:id', auth, roleCheck('Administrator'), getStudentById);
router.put('/:id', auth, roleCheck('Administrator'), updateValidation, updateStudent);
router.delete('/:id', auth, roleCheck('Administrator'), deleteStudent);

router.get('/:id/borrowed-books', auth, getStudentBorrowedBooks);

module.exports = router;
