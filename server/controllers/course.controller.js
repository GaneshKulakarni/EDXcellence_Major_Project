const asyncHandler = require('express-async-handler');
const Course = require('../models/Course.model');
const Enrollment = require('../models/Enrollment.model');
const Review = require('../models/Review.model');

// @desc    Get all published courses (with search/filter/sort)
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const {
        search, category, level, minPrice, maxPrice,
        sort = '-createdAt', page = 1, limit = 12, instructor
    } = req.query;

    const query = { status: 'published', isPublished: true };

    if (search) {
        query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (level) query.level = level;
    if (instructor) query.instructor = instructor;
    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
        .populate('instructor', 'name avatar headline')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-sections');

    res.json({
        success: true,
        count: courses.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        courses
    });
});

// @desc    Get single course (full details)
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('instructor', 'name avatar headline bio website socialLinks')
        .populate({
            path: 'reviews',
            populate: { path: 'student', select: 'name avatar' },
            options: { limit: 10 }
        });

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if user is enrolled (for lesson access)
    let isEnrolled = false;
    if (req.user) {
        const enrollment = await Enrollment.findOne({ student: req.user._id, course: course._id });
        isEnrolled = !!enrollment;
    }

    // If not enrolled and not instructor/admin, hide non-preview lessons content
    const courseData = course.toObject();
    if (!isEnrolled && (!req.user || (req.user.role !== 'admin' && req.user._id.toString() !== course.instructor._id.toString()))) {
        courseData.sections = courseData.sections.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson => ({
                _id: lesson._id,
                title: lesson.title,
                duration: lesson.duration,
                isPreview: lesson.isPreview,
                order: lesson.order,
                // Only show video if preview
                ...(lesson.isPreview ? { videoUrl: lesson.videoUrl } : {})
            }))
        }));
    }

    res.json({ success: true, course: courseData, isEnrolled });
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
const createCourse = asyncHandler(async (req, res) => {
    const courseData = { ...req.body, instructor: req.user._id };
    const course = await Course.create(courseData);
    res.status(201).json({ success: true, course });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Owner Instructor/Admin)
const updateCourse = asyncHandler(async (req, res) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this course');
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, course });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Owner Instructor/Admin)
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this course');
    }

    await course.deleteOne();
    await Enrollment.deleteMany({ course: req.params.id });
    await Review.deleteMany({ course: req.params.id });

    res.json({ success: true, message: 'Course deleted successfully' });
});

// @desc    Get instructor's own courses
// @route   GET /api/courses/my-courses
// @access  Private (Instructor)
const getMyCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ instructor: req.user._id })
        .sort('-createdAt')
        .populate('instructor', 'name avatar');

    res.json({ success: true, count: courses.length, courses });
});

// @desc    Publish/unpublish course (submit for review)
// @route   PATCH /api/courses/:id/publish
// @access  Private (Instructor)
const togglePublish = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized');
    }

    if (!course.isPublished) {
        // Submit for admin approval
        course.status = 'pending';
        course.isPublished = true;
        course.isApproved = false;
    } else {
        course.status = 'draft';
        course.isPublished = false;
        course.isApproved = false;
    }

    await course.save();
    res.json({ success: true, course });
});

// @desc    Add/update section in course
// @route   POST /api/courses/:id/sections
// @access  Private (Instructor)
const addSection = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) { res.status(404); throw new Error('Course not found'); }
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }
    course.sections.push({ ...req.body, order: course.sections.length + 1 });
    await course.save();
    res.status(201).json({ success: true, course });
});

// @desc    Add lesson to section
// @route   POST /api/courses/:id/sections/:sectionId/lessons
// @access  Private (Instructor)
const addLesson = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) { res.status(404); throw new Error('Course not found'); }
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) { res.status(404); throw new Error('Section not found'); }

    section.lessons.push({ ...req.body, order: section.lessons.length + 1 });
    await course.save();
    res.status(201).json({ success: true, course });
});

// @desc    Get featured/trending courses
// @route   GET /api/courses/featured
// @access  Public
const getFeaturedCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ status: 'published', isPublished: true })
        .populate('instructor', 'name avatar headline')
        .sort('-enrolledCount -rating')
        .limit(8)
        .select('-sections');

    res.json({ success: true, courses });
});

module.exports = {
    getCourses, getCourse, createCourse, updateCourse, deleteCourse,
    getMyCourses, togglePublish, addSection, addLesson, getFeaturedCourses
};
