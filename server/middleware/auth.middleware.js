const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');

// Protect routes - require auth
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }
        if (!req.user.isActive) {
            res.status(401);
            throw new Error('Your account is deactivated. Contact admin.');
        }
        next();
    } catch (err) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Role '${req.user.role}' is not authorized to access this route`);
        }
        next();
    };
};

// Admin only
const adminOnly = authorize('admin');

// Instructor or Admin
const instructorOrAdmin = authorize('instructor', 'admin');

module.exports = { protect, authorize, adminOnly, instructorOrAdmin };
