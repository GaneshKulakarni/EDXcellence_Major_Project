const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment.model');
const Course = require('../models/Course.model');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student)
const enrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) { res.status(404); throw new Error('Course not found'); }
    if (!course.isPublished || course.status !== 'published') {
        res.status(400); throw new Error('Course is not available for enrollment');
    }

    const existingEnroll = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existingEnroll) { res.status(400); throw new Error('Already enrolled in this course'); }

    const enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId,
        paymentStatus: course.price === 0 ? 'free' : 'paid'
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    await enrollment.populate('course', 'title thumbnail instructor');

    res.status(201).json({ success: true, enrollment });
});

// @desc    Get my enrollments (student)
// @route   GET /api/enrollments/my
// @access  Private
const getMyEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ student: req.user._id })
        .populate({
            path: 'course',
            populate: { path: 'instructor', select: 'name avatar' },
            select: 'title thumbnail category level totalLessons totalDuration rating enrolledCount instructor'
        })
        .sort('-enrolledAt');

    res.json({ success: true, count: enrollments.length, enrollments });
});

// @desc    Check enrollment status
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
    });
    res.json({ success: true, isEnrolled: !!enrollment, enrollment });
});

// @desc    Unenroll from course
// @route   DELETE /api/enrollments/:courseId
// @access  Private
const unenrollCourse = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findOneAndDelete({
        student: req.user._id,
        course: req.params.courseId
    });

    if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }

    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrolledCount: -1 } });

    res.json({ success: true, message: 'Unenrolled successfully' });
});

// @desc    Get students enrolled in instructor's course
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Instructor/Admin)
const getCourseEnrollments = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) { res.status(404); throw new Error('Course not found'); }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
        .populate('student', 'name email avatar createdAt')
        .sort('-enrolledAt');

    res.json({ success: true, count: enrollments.length, enrollments });
});

module.exports = { enrollCourse, getMyEnrollments, checkEnrollment, unenrollCourse, getCourseEnrollments };
