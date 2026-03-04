const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 }, // in seconds
    content: { type: String, default: '' }, // rich text / notes
    isPreview: { type: Boolean, default: false },
    order: { type: Number, required: true },
    resources: [
        {
            title: String,
            url: String,
            type: { type: String, enum: ['pdf', 'link', 'file'], default: 'link' }
        }
    ]
});

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
            maxlength: [120, 'Title cannot exceed 120 characters']
        },
        slug: { type: String, unique: true },
        description: {
            type: String,
            required: [true, 'Course description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        shortDescription: { type: String, maxlength: [200, 'Short description max 200 chars'], default: '' },
        thumbnail: { type: String, default: '' },
        previewVideo: { type: String, default: '' },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: {
            type: String,
            required: true,
            enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
                'DevOps', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Other']
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
            default: 'All Levels'
        },
        language: { type: String, default: 'English' },
        price: { type: Number, default: 0, min: 0 },
        isFree: { type: Boolean, default: false },
        discount: { type: Number, default: 0, min: 0, max: 100 },
        tags: [String],
        requirements: [String],
        whatYouLearn: [String],
        targetAudience: [String],
        sections: [sectionSchema],
        totalDuration: { type: Number, default: 0 },
        totalLessons: { type: Number, default: 0 },
        enrolledCount: { type: Number, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        ratingCount: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['draft', 'pending', 'published', 'rejected'],
            default: 'draft'
        },
        rejectionReason: { type: String, default: '' }
    },
    { timestamps: true }
);

// Generate slug from title
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    // Calculate totals
    let totalDuration = 0;
    let totalLessons = 0;
    this.sections.forEach(section => {
        section.lessons.forEach(lesson => {
            totalDuration += lesson.duration || 0;
            totalLessons++;
        });
    });
    this.totalDuration = totalDuration;
    this.totalLessons = totalLessons;
    next();
});

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
