const express = require('express');
const router = express.Router();
const { createReview, getCourseReviews, updateReview, deleteReview, replyToReview } = require('../controllers/review.controller');
const { protect, instructorOrAdmin } = require('../middleware/auth.middleware');

router.post('/:courseId', protect, createReview);
router.get('/:courseId', getCourseReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);
router.post('/:reviewId/reply', protect, instructorOrAdmin, replyToReview);

module.exports = router;
