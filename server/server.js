const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes

// Temporary Seeding Fix Route
app.get('/api/debug-seed-fix', async (req, res) => {
  try {
    const Course = require('./models/Course.model');
    const updates = [
      { title: 'Neural Networks from Scratch', thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800' },
      { title: 'NLP with Transformers', thumb: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800' },
      { title: 'Deep Learning Fundamentals', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800' },
      { title: 'Machine Learning with Python', thumb: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=800' }
    ];

    for (const up of updates) {
      await Course.findOneAndUpdate({ title: up.title }, { thumbnail: up.thumb });
    }

    // Also fix any empty ones
    const emptyCourses = await Course.find({ $or: [{ thumbnail: '' }, { thumbnail: null }] });
    for (const ec of emptyCourses) {
      await Course.findByIdAndUpdate(ec._id, {
        thumbnail: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800`
      });
    }

    res.json({ success: true, message: `Updated ML images and fixed ${emptyCourses.length} empty thumbnails.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/quizzes', require('./routes/quiz.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use('/api/progress', require('./routes/progress.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LearnHub API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 LearnHub Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
