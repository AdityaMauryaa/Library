const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protected routes - Admin only
router.get('/stats', auth, roleCheck('Administrator'), getStats);

module.exports = router;
