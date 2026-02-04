const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  issueBook,
  returnBook,
  getAllBorrowed,
  getMyBorrowedBooks,
  getOverdueBooks,
  borrowBookSelf
} = require('../controllers/borrowController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Validation middleware
const issueBookValidation = [
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID'),
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required')
    .isMongoId()
    .withMessage('Invalid book ID')
];

const selfBorrowValidation = [
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required')
    .isMongoId()
    .withMessage('Invalid book ID')
];

// Protected routes - Admin only
router.post('/borrow', auth, roleCheck('Administrator'), issueBookValidation, issueBook);
router.post('/return/:transactionId', auth, roleCheck('Administrator'), returnBook);
router.get('/borrowed', auth, roleCheck('Administrator'), getAllBorrowed);
router.get('/borrowed/overdue', auth, roleCheck('Administrator'), getOverdueBooks);

// Protected routes - Student
router.get('/borrowed/my-books', auth, getMyBorrowedBooks);
router.post('/borrow/self', auth, roleCheck('Student'), selfBorrowValidation, borrowBookSelf);

module.exports = router;
