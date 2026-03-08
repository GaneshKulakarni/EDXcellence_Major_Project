const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Enrollment = require('./models/Enrollment.model');

async function debugEnrollments() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    try {
        const enrollments = await Enrollment.find()
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'name avatar' },
                select: 'title thumbnail category level totalLessons totalDuration rating enrolledCount instructor'
            })
            .sort('-enrolledAt');
        console.log('Successfully found enrollments', enrollments.length);
    } catch (err) {
        console.error('Error during find/populate:', err);
    }

    mongoose.disconnect();
}

debugEnrollments();
