const express = require('express');
const router = express.Router();
const { enrollCourse, getMyEnrollments, checkEnrollment, unenrollCourse, getCourseEnrollments } = require('../controllers/enrollment.controller');
const { protect, instructorOrAdmin } = require('../middleware/auth.middleware');

router.post('/:courseId', protect, enrollCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);
router.delete('/:courseId', protect, unenrollCourse);
router.get('/course/:courseId', protect, instructorOrAdmin, getCourseEnrollments);

module.exports = router;
