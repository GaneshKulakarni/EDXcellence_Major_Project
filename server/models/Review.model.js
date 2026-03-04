const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, trim: true, maxlength: 100 },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },
        isVerifiedPurchase: { type: Boolean, default: true },
        helpfulVotes: { type: Number, default: 0 },
        votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        instructorReply: {
            text: String,
            repliedAt: Date
        }
    },
    { timestamps: true }
);

// One review per student per course
reviewSchema.index({ student: 1, course: 1 }, { unique: true });

// Update course rating after review save
reviewSchema.post('save', async function () {
    const Course = require('./Course.model');
    const stats = await mongoose.model('Review').aggregate([
        { $match: { course: this.course } },
        { $group: { _id: '$course', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats.length > 0) {
        await Course.findByIdAndUpdate(this.course, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            ratingCount: stats[0].count
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);
