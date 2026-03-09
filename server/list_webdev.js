const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const CourseSchema = new mongoose.Schema({
    title: String,
    category: String,
});

const Course = mongoose.model('Course', CourseSchema);

async function listWebDevCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const webDevCourses = await Course.find({ category: 'Web Development' });
        console.log(JSON.stringify(webDevCourses.map(c => c.title), null, 2));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

listWebDevCourses();
