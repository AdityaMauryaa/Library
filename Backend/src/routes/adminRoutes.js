const express = require('express');
const { createAdmin } = require('../controllers/adminController');

const router = express.Router();

// POST /api/admin/create - Create initial admin user
router.post('/create', createAdmin);

module.exports = router;