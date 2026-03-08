const mongoose = require('mongoose');
const Course = require('./models/Course.model');
require('dotenv').config();

const updateCourseThumbnails = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const placeholders = [
            'https://source.unsplash.com/800x600/?technology',
            'https://source.unsplash.com/800x600/?programming',
            'https://source.unsplash.com/800x600/?data-science',
            'https://source.unsplash.com/800x600/?design',
            'https://source.unsplash.com/800x600/?development',
            'https://source.unsplash.com/800x600/?coding',
            'https://source.unsplash.com/800x600/?software',
            'https://source.unsplash.com/800x600/?computer'
        ];

        const courses = await Course.find({ 
            $or: [
                { thumbnail: { $exists: false } },
                { thumbnail: '' },
                { thumbnail: null }
            ]
        });

        console.log(`Found ${courses.length} courses without thumbnails`);

        for (const course of courses) {
            const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
            course.thumbnail = randomPlaceholder;
            await course.save();
            console.log(`Updated thumbnail for course: ${course.title}`);
        }

        console.log('✅ All course thumbnails updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating thumbnails:', error);
        process.exit(1);
    }
};

updateCourseThumbnails();
