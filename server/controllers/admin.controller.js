const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const Course = require('../models/Course.model');
const Enrollment = require('../models/Enrollment.model');
const Review = require('../models/Review.model');

// @desc    Admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalCourses, totalEnrollments, totalReviews,
        pendingCourses, students, instructors] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments({ status: 'published' }),
            Enrollment.countDocuments(),
            Review.countDocuments(),
            Course.countDocuments({ status: 'pending' }),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'instructor' })
        ]);

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentEnrollments = await Enrollment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Top courses
    const topCourses = await Course.find({ status: 'published' })
        .populate('instructor', 'name')
        .sort('-enrolledCount')
        .limit(5)
        .select('title enrolledCount rating totalLessons');

    // Recent users
    const recentUsers = await User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email role avatar createdAt');

    res.json({
        success: true,
        stats: {
            totalUsers, totalCourses, totalEnrollments, totalReviews,
            pendingCourses, students, instructors, recentEnrollments
        },
        topCourses,
        recentUsers
    });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit));

    res.json({ success: true, total, users });
});

// @desc    Update user role/status (Admin)
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.id, { role, isActive }, { new: true, runValidators: true }
    );
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, user });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, message: 'User deleted' });
});

// @desc    Get all courses (admin - includes pending)
// @route   GET /api/admin/courses
// @access  Private (Admin)
const getAllCourses = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
        .populate('instructor', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .select('-sections');

    res.json({ success: true, total, courses });
});

// @desc    Approve or reject course
// @route   PATCH /api/admin/courses/:id/approve
// @access  Private (Admin)
const approveCourse = asyncHandler(async (req, res) => {
    const { approved, reason } = req.body;
    const course = await Course.findByIdAndUpdate(
        req.params.id,
        {
            isApproved: approved,
            status: approved ? 'published' : 'rejected',
            rejectionReason: approved ? '' : reason
        },
        { new: true }
    ).populate('instructor', 'name email');

    if (!course) { res.status(404); throw new Error('Course not found'); }
    res.json({ success: true, course });
});

module.exports = { getDashboardStats, getAllUsers, updateUser, deleteUser, getAllCourses, approveCourse };
