const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const CourseSchema = new mongoose.Schema({
    title: String,
    category: String,
    thumbnail: String
});

const Course = mongoose.model('Course', CourseSchema);

async function analyzeImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const allCourses = await Course.find({});

        const categories = {};

        allCourses.forEach(course => {
            const cat = course.category || 'Uncategorized';
            if (!categories[cat]) {
                categories[cat] = { total: 0, distinctThumbnails: new Set() };
            }
            categories[cat].total++;
            categories[cat].distinctThumbnails.add(course.thumbnail);
        });

        console.log('\n--- Course Image Analysis ---');
        Object.keys(categories).forEach(cat => {
            console.log(`\nCategory: ${cat}`);
            console.log(`Total Courses: ${categories[cat].total}`);
            console.log(`Unique Thumbnails: ${categories[cat].distinctThumbnails.size}`);
            console.log(`Examples:`, Array.from(categories[cat].distinctThumbnails).slice(0, 3));
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

analyzeImages();
