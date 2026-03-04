const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        enrolledAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
        isCompleted: { type: Boolean, default: false },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        completedLessons: [{ type: String }], // lesson IDs as strings
        lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId },
        lastAccessedAt: { type: Date },
        certificate: { type: String, default: '' },
        hasCertificate: { type: Boolean, default: false },
        paymentStatus: {
            type: String,
            enum: ['free', 'paid', 'pending'],
            default: 'free'
        },
        amountPaid: { type: Number, default: 0 }
    },
    { timestamps: true }
);

// One enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
