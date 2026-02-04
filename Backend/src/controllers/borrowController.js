const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');
const User = require('../models/User');

// Fine calculation: $2 per day after due date
const FINE_PER_DAY = 2;
const BORROWING_PERIOD_DAYS = 14; // 2 weeks

/**
 * @desc    Issue book to student
 * @route   POST /api/borrow
 * @access  Private/Admin
 */
exports.issueBook = async (req, res, next) => {
  try {
    const { studentId, bookId } = req.body;

    // Verify student exists and has Student role
    const student = await User.findOne({ _id: studentId, role: 'Student' });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if student already has this book borrowed
    const existingBorrow = await BorrowedBook.findOne({
      studentId,
      bookId,
      status: 'Borrowed'
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'Student has already borrowed this book'
      });
    }

    // Calculate due date (14 days from now)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROWING_PERIOD_DAYS);

    // Create borrowed book record
    const borrowedBook = await BorrowedBook.create({
      studentId,
      bookId,
      issueDate,
      dueDate,
      status: 'Borrowed'
    });

    // Decrement book availability
    book.availableQty -= 1;
    await book.save();

    // Populate details for response
    await borrowedBook.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'bookId', select: 'title author ISBN' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      data: borrowedBook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Return a borrowed book
 * @route   POST /api/return/:transactionId
 * @access  Private/Admin
 */
exports.returnBook = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    // Find the borrowed book transaction
    const borrowedBook = await BorrowedBook.findById(transactionId)
      .populate('studentId', 'name email')
      .populate('bookId', 'title author ISBN');

    if (!borrowedBook) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (borrowedBook.status === 'Returned') {
      return res.status(400).json({
        success: false,
        message: 'Book has already been returned'
      });
    }

    // Calculate fine if overdue
    const returnDate = new Date();
    const dueDate = new Date(borrowedBook.dueDate);
    let fine = 0;

    if (returnDate > dueDate) {
      const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * FINE_PER_DAY;
    }

    // Update borrowed book record
    borrowedBook.returnDate = returnDate;
    borrowedBook.fine = fine;
    borrowedBook.status = 'Returned';
    await borrowedBook.save();

    // Increment book availability
    const book = await Book.findById(borrowedBook.bookId);
    if (book) {
      book.availableQty += 1;
      await book.save();
    }

    res.status(200).json({
      success: true,
      message: fine > 0 
        ? `Book returned successfully. Fine: $${fine}` 
        : 'Book returned successfully',
      data: borrowedBook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all borrowed books
 * @route   GET /api/borrowed
 * @access  Private/Admin
 */
exports.getAllBorrowed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Optional filter by status

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const borrowedBooks = await BorrowedBook.find(filter)
      .populate('studentId', 'name email')
      .populate('bookId', 'title author ISBN')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BorrowedBook.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: borrowedBooks.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: borrowedBooks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's borrowed books
 * @route   GET /api/borrowed/my-books
 * @access  Private/Student
 */
exports.getMyBorrowedBooks = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const borrowedBooks = await BorrowedBook.find({ studentId })
      .populate('bookId', 'title author ISBN')
      .sort({ issueDate: -1 });

    // Calculate current fines for overdue books
    const now = new Date();
    const booksWithCurrentFine = borrowedBooks.map(book => {
      const bookObj = book.toObject();
      
      if (bookObj.status === 'Borrowed' && now > new Date(bookObj.dueDate)) {
        const daysOverdue = Math.ceil((now - new Date(bookObj.dueDate)) / (1000 * 60 * 60 * 24));
        bookObj.currentFine = daysOverdue * FINE_PER_DAY;
      } else if (bookObj.status === 'Returned') {
        bookObj.currentFine = bookObj.fine;
      } else {
        bookObj.currentFine = 0;
      }
      
      return bookObj;
    });

    // Calculate total fine
    const totalFine = booksWithCurrentFine.reduce((sum, book) => sum + book.currentFine, 0);

    res.status(200).json({
      success: true,
      count: borrowedBooks.length,
      totalFine,
      data: booksWithCurrentFine
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get overdue books list
 * @route   GET /api/borrowed/overdue
 * @access  Private/Admin
 */
exports.getOverdueBooks = async (req, res, next) => {
  try {
    const now = new Date();

    // Find all borrowed books with due date passed
    const overdueBooks = await BorrowedBook.find({
      status: 'Borrowed',
      dueDate: { $lt: now }
    })
      .populate('studentId', 'name email')
      .populate('bookId', 'title author ISBN')
      .sort({ dueDate: 1 }); // Oldest overdue first

    // Calculate current fine for each overdue book
    const booksWithFine = overdueBooks.map(book => {
      const bookObj = book.toObject();
      const daysOverdue = Math.ceil((now - new Date(bookObj.dueDate)) / (1000 * 60 * 60 * 24));
      bookObj.daysOverdue = daysOverdue;
      bookObj.calculatedFine = daysOverdue * FINE_PER_DAY;
      return bookObj;
    });

    res.status(200).json({
      success: true,
      count: booksWithFine.length,
      data: booksWithFine
    });
  } catch (error) {
    next(error);
  }
};
