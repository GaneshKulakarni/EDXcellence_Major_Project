const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Ensure a user can only add a course once to cart
cartSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
