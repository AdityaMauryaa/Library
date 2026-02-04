const Book = require('../models/Book');
const User = require('../models/User');
const BorrowedBook = require('../models/BorrowedBook');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
exports.getStats = async (req, res, next) => {
  try {
    // Total books count
    const totalBooks = await Book.countDocuments();

    // Total students count
    const totalStudents = await User.countDocuments({ role: 'Student' });

    // Books issued today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const booksIssuedToday = await BorrowedBook.countDocuments({
      issueDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Overdue books count
    const now = new Date();
    const overdueBooks = await BorrowedBook.countDocuments({
      status: 'Borrowed',
      dueDate: { $lt: now }
    });

    // Total fine collected (from returned books)
    const fineResult = await BorrowedBook.aggregate([
      {
        $match: {
          status: 'Returned',
          fine: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          totalFine: { $sum: '$fine' }
        }
      }
    ]);

    const totalFineCollected = fineResult.length > 0 ? fineResult[0].totalFine : 0;

    // Additional useful stats
    const totalBorrowed = await BorrowedBook.countDocuments({ status: 'Borrowed' });
    const totalAvailableBooks = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalAvailable: { $sum: '$availableQty' }
        }
      }
    ]);

    const availableBooks = totalAvailableBooks.length > 0 ? totalAvailableBooks[0].totalAvailable : 0;

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalStudents,
        booksIssuedToday,
        overdueBooks,
        totalFineCollected,
        currentlyBorrowed: totalBorrowed,
        availableBooks
      }
    });
  } catch (error) {
    next(error);
  }
};
