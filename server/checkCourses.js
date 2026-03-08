const mongoose = require('mongoose');
const Course = require('./models/Course.model');
require('dotenv').config();

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const courses = await Course.find({});
        console.log(`\n📚 Total courses in database: ${courses.length}\n`);

        if (courses.length > 0) {
            courses.forEach((course, index) => {
                console.log(`\n--- Course ${index + 1} ---`);
                console.log(`📖 Title: ${course.title}`);
                console.log(`🆔 ID: ${course._id}`);
                console.log(`👨‍🏫 Instructor: ${course.instructor}`);
                console.log(`🖼️ Thumbnail: ${course.thumbnail ? 'YES' : 'NO'}`);
                console.log(`💰 Price: ₹${course.price || 0}`);
                console.log(`⭐ Rating: ${course.rating || 0}`);
                console.log(`👥 Students: ${course.enrolledCount || 0}`);
                console.log(`📚 Sections: ${course.sections?.length || 0}`);
                console.log(`📝 Total Lessons: ${course.totalLessons || 0}`);
            });

            // Test specific course lookup
            const firstCourse = courses[0];
            if (firstCourse) {
                console.log(`\n🔍 Testing lookup for first course...`);
                const foundCourse = await Course.findById(firstCourse._id)
                    .populate('instructor', 'name avatar headline')
                    .populate({
                        path: 'reviews',
                        populate: { path: 'student', select: 'name avatar' },
                        options: { limit: 5 }
                    });
                
                console.log(`✅ Found course with populate:`, foundCourse ? 'YES' : 'NO');
                if (foundCourse) {
                    console.log(`📖 Title: ${foundCourse.title}`);
                    console.log(`👨‍🏫 Instructor: ${foundCourse.instructor?.name}`);
                    console.log(`⭐ Reviews: ${foundCourse.reviews?.length || 0}`);
                }
            }
        } else {
            console.log('❌ No courses found in database!');
        }

        await mongoose.disconnect();
        console.log('\n✅ Database check completed');
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

checkCourses();
