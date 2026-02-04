const User = require('../models/User');
const BorrowedBook = require('../models/BorrowedBook');

/**
 * @desc    Get all students with pagination
 * @route   GET /api/students
 * @access  Private/Admin
 */
exports.getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only get users with Student role, exclude password
    const students = await User.find({ role: 'Student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'Student' });

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student details
 * @route   GET /api/students/:id
 * @access  Private/Admin
 */
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'Student' 
    }).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student info
 * @route   PUT /api/students/:id
 * @access  Private/Admin
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check if student exists
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'Student' 
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if email is being changed to an existing email
    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: {
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private/Admin
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'Student' 
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student has any borrowed books
    const borrowedBooks = await BorrowedBook.countDocuments({ 
      studentId: req.params.id,
      status: 'Borrowed'
    });

    if (borrowedBooks > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete student with borrowed books. Please return all books first.'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student's borrowed books
 * @route   GET /api/students/:id/borrowed-books
 * @access  Private (Student can view own, Admin can view any)
 */
exports.getStudentBorrowedBooks = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Check if user is accessing their own data or is admin
    if (req.user.role !== 'Administrator' && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own borrowed books.'
      });
    }

    // Check if student exists
    const student = await User.findOne({ 
      _id: studentId, 
      role: 'Student' 
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const borrowedBooks = await BorrowedBook.find({ studentId })
      .populate('bookId', 'title author ISBN')
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: borrowedBooks.length,
      data: borrowedBooks
    });
  } catch (error) {
    next(error);
  }
};
