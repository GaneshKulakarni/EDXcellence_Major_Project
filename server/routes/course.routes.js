const express = require('express');
const router = express.Router();
const {
    getCourses, getCourse, createCourse, updateCourse, deleteCourse,
    getMyCourses, togglePublish, addSection, addLesson, getFeaturedCourses
} = require('../controllers/course.controller');
const { protect, instructorOrAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourse);

// Protected routes
router.get('/instructor/my-courses', protect, instructorOrAdmin, getMyCourses);
router.post('/', protect, instructorOrAdmin, createCourse);
router.put('/:id', protect, instructorOrAdmin, updateCourse);
router.delete('/:id', protect, instructorOrAdmin, deleteCourse);
router.patch('/:id/publish', protect, instructorOrAdmin, togglePublish);
router.post('/:id/sections', protect, instructorOrAdmin, addSection);
router.post('/:id/sections/:sectionId/lessons', protect, instructorOrAdmin, addLesson);

module.exports = router;
