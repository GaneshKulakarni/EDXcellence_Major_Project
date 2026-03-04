const express = require('express');
const router = express.Router();
const { createQuiz, getCourseQuizzes, getQuiz, submitQuizAttempt, getMyAttempts, updateQuiz, deleteQuiz } = require('../controllers/quiz.controller');
const { protect, instructorOrAdmin } = require('../middleware/auth.middleware');

router.post('/', protect, instructorOrAdmin, createQuiz);
router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuiz);
router.post('/:id/attempt', protect, submitQuizAttempt);
router.get('/:id/attempts', protect, getMyAttempts);
router.put('/:id', protect, instructorOrAdmin, updateQuiz);
router.delete('/:id', protect, instructorOrAdmin, deleteQuiz);

module.exports = router;
