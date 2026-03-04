const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, default: false }
        }
    ],
    explanation: { type: String, default: '' },
    points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        lesson: { type: mongoose.Schema.Types.ObjectId }, // optional - lesson-level quiz
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        questions: [questionSchema],
        timeLimit: { type: Number, default: 0 }, // in minutes, 0 = no limit
        passingScore: { type: Number, default: 70 }, // percentage
        maxAttempts: { type: Number, default: 3 },
        isPublished: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const quizAttemptSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        answers: [
            {
                questionIndex: Number,
                selectedOption: Number,
                isCorrect: Boolean,
                pointsEarned: Number
            }
        ],
        score: { type: Number, default: 0 }, // percentage
        totalPoints: { type: Number, default: 0 },
        earnedPoints: { type: Number, default: 0 },
        passed: { type: Boolean, default: false },
        timeTaken: { type: Number, default: 0 }, // in seconds
        attemptNumber: { type: Number, default: 1 },
        completedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = { Quiz, QuizAttempt };
