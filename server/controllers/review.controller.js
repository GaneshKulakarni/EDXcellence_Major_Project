const asyncHandler = require('express-async-handler');
const Review = require('../models/Review.model');
const Enrollment = require('../models/Enrollment.model');
const Course = require('../models/Course.model');

// @desc    Create review
// @route   POST /api/reviews/:courseId
// @access  Private (Student - must be enrolled)
const createReview = asyncHandler(async (req, res) => {
    const { rating, title, comment } = req.body;
    const { courseId } = req.params;

    // Must be enrolled
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) { res.status(403); throw new Error('You must be enrolled to review this course'); }

    // Check if already reviewed
    const existing = await Review.findOne({ student: req.user._id, course: courseId });
    if (existing) { res.status(400); throw new Error('You have already reviewed this course'); }

    const review = await Review.create({
        student: req.user._id,
        course: courseId,
        rating,
        title,
        comment,
        isVerifiedPurchase: true
    });

    await review.populate('student', 'name avatar');

    res.status(201).json({ success: true, review });
});

// @desc    Get reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments({ course: req.params.courseId });
    const reviews = await Review.find({ course: req.params.courseId })
        .populate('student', 'name avatar headline')
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    // Rating breakdown
    const breakdown = await Review.aggregate([
        { $match: { course: require('mongoose').Types.ObjectId.createFromHexString(req.params.courseId) } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: -1 } }
    ]);

    res.json({
        success: true,
        count: reviews.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        reviews,
        breakdown
    });
});

// @desc    Update review
// @route   PUT /api/reviews/:reviewId
// @access  Private (Owner)
const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review) { res.status(404); throw new Error('Review not found'); }
    if (review.student.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error('Not authorized to update this review');
    }

    const updated = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
        new: true, runValidators: true
    }).populate('student', 'name avatar');

    res.json({ success: true, review: updated });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (Owner/Admin)
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review) { res.status(404); throw new Error('Review not found'); }
    if (review.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
});

// @desc    Add instructor reply to review
// @route   POST /api/reviews/:reviewId/reply
// @access  Private (Instructor)
const replyToReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('course');
    if (!review) { res.status(404); throw new Error('Review not found'); }

    if (review.course.instructor.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error('Not authorized');
    }

    review.instructorReply = { text: req.body.text, repliedAt: new Date() };
    await review.save();

    res.json({ success: true, review });
});

module.exports = { createReview, getCourseReviews, updateReview, deleteReview, replyToReview };
