const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    availableQty: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and performance
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ ISBN: 1 });
bookSchema.index({ course: 1 });
bookSchema.index({ availableQty: 1 });

module.exports = mongoose.model('Book', bookSchema);
