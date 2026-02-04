const Book = require('../models/Book');
const { validationResult } = require('express-validator');

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const courseFilter = req.query.course ? { course: req.query.course } : {};

    const books = await Book.find(courseFilter)
      .populate('course', 'courseName courseCode')
      .limit(limit)
      .skip(skip)
      .sort({ title: 1 });

    const total = await Book.countDocuments(courseFilter);

    res.json({
      success: true,
      count: books.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: books,
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const getAvailableBooks = async (req, res) => {
  try {
    const courseFilter = req.query.course ? { course: req.query.course } : {};

    const books = await Book.find({ ...courseFilter, availableQty: { $gt: 0 } })
      .populate('course', 'courseName courseCode')
      .sort({ title: 1 });

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error('Get available books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate('course', 'courseName courseCode');
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Search books by title or author
const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ],
    }).populate('course', 'courseName courseCode');

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Add new book (Admin only)
const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, author, ISBN, course, quantity } = req.body;

    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'Book with this ISBN already exists',
      });
    }

    const book = new Book({
      title,
      author,
      ISBN,
      course,
      quantity,
      availableQty: quantity,
    });

    await book.save();
    await book.populate('course', 'courseName courseCode');

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book,
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { title, author, ISBN, course, quantity } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (ISBN && ISBN !== book.ISBN) {
      const existingBook = await Book.findOne({ ISBN });
      if (existingBook) {
        return res.status(409).json({
          success: false,
          message: 'Book with this ISBN already exists',
        });
      }
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.ISBN = ISBN || book.ISBN;
    book.course = course || book.course;

    if (quantity !== undefined) {
      const difference = quantity - book.quantity;
      book.quantity = quantity;
      book.availableQty = Math.max(0, book.availableQty + difference);
    }

    await book.save();
    await book.populate('course', 'courseName courseCode');

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getAllBooks,
  getAvailableBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
};
