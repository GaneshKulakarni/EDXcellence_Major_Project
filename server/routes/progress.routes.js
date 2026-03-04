const express = require('express');
const router = express.Router();
const { markLessonComplete, getCourseProgress } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/:courseId/lesson/:lessonId', protect, markLessonComplete);
router.get('/:courseId', protect, getCourseProgress);

module.exports = router;
