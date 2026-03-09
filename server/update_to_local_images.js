const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const CourseSchema = new mongoose.Schema({
    title: String,
    category: String,
    thumbnail: String
});

const Course = mongoose.model('Course', CourseSchema);

const IMAGE_DIR = path.join(__dirname, '..', 'client', 'public', 'images');

const CATEGORY_MAP = {
    'Web Development': 'web-dev',
    'Data Science': 'data-sience',
    'Marketing': 'marketing',
    'Mobile Development': 'mobile-dev'
};

async function updateToLocalImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        for (const [category, folder] of Object.entries(CATEGORY_MAP)) {
            const folderPath = path.join(IMAGE_DIR, folder);
            if (!fs.existsSync(folderPath)) {
                console.log(`Skipping ${category} - folder not found: ${folderPath}`);
                continue;
            }

            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
            const courses = await Course.find({ category: category });

            console.log(`\nCategory: ${category} (${courses.length} courses, ${files.length} images)`);

            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];
                // Use modulo to cycle through images if there are more courses than images
                const imageFile = files[i % files.length];
                const localPath = `/images/${folder}/${imageFile}`;

                course.thumbnail = localPath;
                await course.save();
                console.log(`✅ Updated: ${course.title} -> ${localPath}`);
            }
        }

        console.log('\n🎉 Finished updating thumbnails to local images!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateToLocalImages();
