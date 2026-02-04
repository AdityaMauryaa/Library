const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

// Secret code for admin registration - in production, use environment variable
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'ADMIN2024';

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, password, role, adminCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Determine user role
    let userRole = 'Student';
    if (role === 'Administrator') {
      // Verify admin secret code
      if (!adminCode || adminCode !== ADMIN_SECRET_CODE) {
        return res.status(403).json({
          success: false,
          message: 'Invalid admin secret code',
        });
      }
      userRole = 'Administrator';
    }

    const user = new User({ name, email, password, role: userRole });
    await user.save();

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: `${userRole} registered successfully`,
      data: { token, user },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    user.password = undefined;

    res.json({
      success: true,
      message: 'Login successful',
      data: { token, user },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { register, login, getProfile };
