const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart.model');
const Course = require('../models/Course.model');

// @desc    Add course to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if course is free
    if (course.price === 0) {
        res.status(400);
        throw new Error('Free courses cannot be added to cart. Please enroll directly.');
    }

    // Check if already in cart
    const existingCartItem = await Cart.findOne({ userId, courseId });
    if (existingCartItem) {
        res.status(400);
        throw new Error('Course already in cart');
    }

    // Add to cart
    const cartItem = await Cart.create({
        userId,
        courseId,
        price: course.price
    });

    // Populate course details
    await cartItem.populate('courseId', 'title thumbnail price instructor');

    res.status(201).json({
        success: true,
        message: 'Course added to cart successfully',
        cartItem
    });
});

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cartItems = await Cart.find({ userId })
        .populate('courseId', 'title thumbnail price instructor category level totalDuration totalLessons enrolledCount rating')
        .populate('courseId.instructor', 'name avatar')
        .sort('-addedAt');

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    res.json({
        success: true,
        count: cartItems.length,
        totalPrice,
        cartItems
    });
});

// @desc    Remove course from cart
// @route   DELETE /api/cart/remove/:courseId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const cartItem = await Cart.findOneAndDelete({ userId, courseId });
    
    if (!cartItem) {
        res.status(404);
        throw new Error('Course not found in cart');
    }

    res.json({
        success: true,
        message: 'Course removed from cart successfully'
    });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Cart.deleteMany({ userId });

    res.json({
        success: true,
        message: 'Cart cleared successfully'
    });
});

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};
