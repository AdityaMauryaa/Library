const Course = require('../models/Course');
const { validationResult } = require('express-validator');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseName: 1 });
    
    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Add new course (Admin only)
const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { courseName, courseCode, description } = req.body;

    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'Course with this code already exists',
      });
    }

    const course = new Course({ courseName, courseCode, description });
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update course (Admin only)
const updateCourse = async (req, res) => {
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
    const { courseName, courseCode, description } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (courseCode && courseCode !== course.courseCode) {
      const existingCourse = await Course.findOne({ courseCode });
      if (existingCourse) {
        return res.status(409).json({
          success: false,
          message: 'Course with this code already exists',
        });
      }
    }

    course.courseName = courseName || course.courseName;
    course.courseCode = courseCode || course.courseCode;
    course.description = description || course.description;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
