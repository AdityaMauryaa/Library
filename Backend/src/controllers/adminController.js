const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Temporary function to create admin user
const createAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'Administrator' });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin user already exists',
      });
    }

    // Create admin user with default credentials
    const adminData = {
      name: 'Library Admin',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'Administrator'
    };

    const admin = new User(adminData);
    await admin.save();

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: { 
        token, 
        user: admin,
        credentials: {
          email: 'admin@library.com',
          password: 'admin123'
        }
      },
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin creation',
    });
  }
};

module.exports = { createAdmin };