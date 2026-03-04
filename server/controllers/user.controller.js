const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const Course = require('../models/Course.model');
const Enrollment = require('../models/Enrollment.model');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) { res.status(404); throw new Error('User not found'); }

    // Get instructor courses if applicable
    let courses = [];
    if (user.role === 'instructor') {
        courses = await Course.find({ instructor: user._id, status: 'published' })
            .select('title thumbnail rating enrolledCount totalLessons category')
            .limit(10);
    }

    res.json({ success: true, user, courses });
});

// @desc    Get instructors list
// @route   GET /api/users/instructors
// @access  Public
const getInstructors = asyncHandler(async (req, res) => {
    const instructors = await User.find({ role: 'instructor', isActive: true })
        .select('name avatar headline bio')
        .limit(20);
    res.json({ success: true, instructors });
});

module.exports = { getUserProfile, getInstructors };
