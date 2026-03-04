const asyncHandler = require('express-async-handler');
const { Quiz, QuizAttempt } = require('../models/Quiz.model');
const Enrollment = require('../models/Enrollment.model');

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin)
const createQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, quiz });
});

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
const getCourseQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ course: req.params.courseId, isPublished: true })
        .select('-questions.options.isCorrect'); // hide correct answers
    res.json({ success: true, quizzes });
});

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) { res.status(404); throw new Error('Quiz not found'); }

    // Check enrollment and attempts
    const attempts = await QuizAttempt.find({ student: req.user._id, quiz: req.params.id })
        .sort('-createdAt').limit(1);

    const quizData = quiz.toObject();
    // Hide correct answers from students
    if (req.user.role === 'student') {
        quizData.questions = quizData.questions.map(q => ({
            ...q,
            options: q.options.map(o => ({ text: o.text, _id: o._id }))
        }));
    }

    res.json({ success: true, quiz: quizData, attempts });
});

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private (Student)
const submitQuizAttempt = asyncHandler(async (req, res) => {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) { res.status(404); throw new Error('Quiz not found'); }

    // Check max attempts
    const attemptCount = await QuizAttempt.countDocuments({ student: req.user._id, quiz: req.params.id });
    if (attemptCount >= quiz.maxAttempts) {
        res.status(400);
        throw new Error(`Maximum attempts (${quiz.maxAttempts}) reached`);
    }

    // Grade the quiz
    let earnedPoints = 0;
    let totalPoints = 0;
    const gradedAnswers = answers.map((answer, idx) => {
        const question = quiz.questions[answer.questionIndex];
        if (!question) return answer;
        totalPoints += question.points;
        const correctOption = question.options.findIndex(o => o.isCorrect);
        const isCorrect = answer.selectedOption === correctOption;
        if (isCorrect) earnedPoints += question.points;
        return { ...answer, isCorrect, pointsEarned: isCorrect ? question.points : 0 };
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
        student: req.user._id,
        quiz: quiz._id,
        course: quiz.course,
        answers: gradedAnswers,
        score,
        totalPoints,
        earnedPoints,
        passed,
        timeTaken,
        attemptNumber: attemptCount + 1
    });

    res.status(201).json({
        success: true,
        attempt: { ...attempt.toObject(), quiz: { title: quiz.title, passingScore: quiz.passingScore } }
    });
});

// @desc    Get my quiz attempts
// @route   GET /api/quizzes/:id/attempts
// @access  Private
const getMyAttempts = asyncHandler(async (req, res) => {
    const attempts = await QuizAttempt.find({
        student: req.user._id,
        quiz: req.params.id
    }).sort('-createdAt');

    res.json({ success: true, attempts });
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Instructor/Admin)
const updateQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
    res.json({ success: true, quiz });
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Instructor/Admin)
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
    res.json({ success: true, message: 'Quiz deleted' });
});

module.exports = { createQuiz, getCourseQuizzes, getQuiz, submitQuizAttempt, getMyAttempts, updateQuiz, deleteQuiz };
