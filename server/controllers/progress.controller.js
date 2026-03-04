const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment.model');
const Course = require('../models/Course.model');

// @desc    Mark lesson as complete / update progress
// @route   POST /api/progress/:courseId/lesson/:lessonId
// @access  Private (Student - must be enrolled)
const markLessonComplete = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) { res.status(404); throw new Error('Not enrolled in this course'); }

    // Add lesson if not already completed
    if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
    }

    // Calculate progress
    const course = await Course.findById(courseId);
    const totalLessons = course.totalLessons || 1;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);
    enrollment.lastAccessedLesson = lessonId;
    enrollment.lastAccessedAt = new Date();

    // Check if course completed
    if (enrollment.progress >= 100) {
        enrollment.isCompleted = true;
        enrollment.completedAt = new Date();
        enrollment.hasCertificate = true;
    }

    await enrollment.save();

    res.json({
        success: true,
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        completedLessons: enrollment.completedLessons
    });
});

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
const getCourseProgress = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
    });

    if (!enrollment) { res.status(404); throw new Error('Not enrolled in this course'); }

    res.json({
        success: true,
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.isCompleted,
        lastAccessedLesson: enrollment.lastAccessedLesson,
        hasCertificate: enrollment.hasCertificate
    });
});

module.exports = { markLessonComplete, getCourseProgress };
