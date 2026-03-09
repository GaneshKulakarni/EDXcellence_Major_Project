const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const CourseSchema = new mongoose.Schema({
    title: String,
    category: String,
});

const Course = mongoose.model('Course', CourseSchema);

async function pruneCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Prune Web Development
        const webDevToRemove = [
            "React Development course",
            "React js course",
            "Test React Course"
        ];

        const result = await Course.deleteMany({
            category: 'Web Development',
            title: { $in: webDevToRemove }
        });

        console.log(`Removed ${result.deletedCount} courses from Web Development.`);

        // Double check all categories
        const counts = await Course.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        console.log('\n--- Final Course Counts ---');
        counts.forEach(c => {
            console.log(`${c._id || 'Uncategorized'}: ${c.count}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

pruneCourses();
