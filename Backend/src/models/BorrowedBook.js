const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Borrowed', 'Returned', 'Overdue'],
      default: 'Borrowed',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queries
borrowedBookSchema.index({ studentId: 1 });
borrowedBookSchema.index({ bookId: 1 });
borrowedBookSchema.index({ status: 1 });
borrowedBookSchema.index({ dueDate: 1 });
borrowedBookSchema.index({ issueDate: -1 });

module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);
