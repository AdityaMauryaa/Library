const express = require('express');
const { body } = require('express-validator');
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public route - Get all courses
router.get('/', getAllCourses);

// Admin only routes
router.post(
  '/',
  auth,
  roleCheck('Administrator'),
  [
    body('courseName').trim().notEmpty().withMessage('Course name is required'),
    body('courseCode').trim().notEmpty().withMessage('Course code is required'),
  ],
  createCourse
);

router.put(
  '/:id',
  auth,
  roleCheck('Administrator'),
  [
    body('courseName').optional().trim().notEmpty().withMessage('Course name cannot be empty'),
    body('courseCode').optional().trim().notEmpty().withMessage('Course code cannot be empty'),
  ],
  updateCourse
);

router.delete('/:id', auth, roleCheck('Administrator'), deleteCourse);

module.exports = router;
