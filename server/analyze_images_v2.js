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
        const allCourses = await Course.find({});

        const categories = {};

        allCourses.forEach(course => {
            const cat = course.category || 'Uncategorized';
            if (!categories[cat]) {
                categories[cat] = { total: 0, unsplash: 0, cloudinary: 0, empty: 0, other: 0 };
            }

            categories[cat].total++;

            const thumb = course.thumbnail || '';
            if (!thumb || thumb === '') {
                categories[cat].empty++;
            } else if (thumb.includes('cloudinary.com')) {
                categories[cat].cloudinary++;
            } else if (thumb.includes('unsplash.com')) {
                categories[cat].unsplash++;
            } else {
                categories[cat].other++;
            }
        });

        console.log(JSON.stringify(categories, null, 2));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

analyzeImages();
