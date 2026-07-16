const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
