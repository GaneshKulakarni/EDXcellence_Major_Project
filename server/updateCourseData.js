const mongoose = require('mongoose');
const Course = require('./models/Course.model');
const User = require('./models/User.model');
require('dotenv').config();

const updateCourseData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get a sample instructor ID (or create one if needed)
        let instructor = await User.findOne({ role: 'instructor' });
        if (!instructor) {
            // Create a sample instructor if none exists
            instructor = await User.create({
                name: 'John Doe',
                email: 'instructor@example.com',
                password: 'password123',
                role: 'instructor',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
            });
        }

        const courseUpdates = [
            {
                title: 'Complete Web Development Bootcamp',
                description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more. This comprehensive course covers everything you need to become a professional web developer.',
                shortDescription: 'Become a full-stack web developer with this comprehensive bootcamp',
                category: 'Web Development',
                level: 'Beginner',
                price: 799,
                instructorName: 'John Doe',
                rating: 4.8,
                enrolledCount: 15420,
                totalDuration: 43200, // 12 hours in seconds
                totalLessons: 156,
                lessons: [
                    { title: 'Introduction to Web Development', duration: 300, order: 1 },
                    { title: 'HTML Fundamentals', duration: 600, order: 2 },
                    { title: 'CSS Styling Basics', duration: 480, order: 3 },
                    { title: 'JavaScript Essentials', duration: 720, order: 4 },
                    { title: 'React Introduction', duration: 540, order: 5 }
                ],
                whatYouLearn: [
                    'Build responsive websites with HTML, CSS, and JavaScript',
                    'Master React and modern frontend frameworks',
                    'Create backend APIs with Node.js and Express',
                    'Work with databases and authentication',
                    'Deploy applications to production'
                ],
                requirements: [
                    'No programming experience needed',
                    'A computer with internet access',
                    'Willingness to learn and practice'
                ]
            },
            {
                title: 'Python for Data Science and Machine Learning',
                description: 'Master Python programming for data science, machine learning, and artificial intelligence. Learn NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow.',
                shortDescription: 'Complete Python bootcamp for data science and ML',
                category: 'Data Science',
                level: 'Intermediate',
                price: 1299,
                instructorName: 'Dr. Sarah Chen',
                rating: 4.9,
                enrolledCount: 23150,
                totalDuration: 57600, // 16 hours
                totalLessons: 189,
                lessons: [
                    { title: 'Python Basics Refresher', duration: 420, order: 1 },
                    { title: 'NumPy for Numerical Computing', duration: 540, order: 2 },
                    { title: 'Pandas for Data Analysis', duration: 660, order: 3 },
                    { title: 'Data Visualization with Matplotlib', duration: 480, order: 4 },
                    { title: 'Machine Learning Fundamentals', duration: 720, order: 5 }
                ],
                whatYouLearn: [
                    'Master Python programming for data science',
                    'Work with NumPy and Pandas for data manipulation',
                    'Create stunning data visualizations',
                    'Build machine learning models',
                    'Understand deep learning concepts'
                ],
                requirements: [
                    'Basic Python programming knowledge',
                    'Understanding of basic statistics',
                    'Computer capable of running Python'
                ]
            },
            {
                title: 'React Native Mobile App Development',
                description: 'Build native mobile apps for iOS and Android using React Native. Learn to create cross-platform applications with a single codebase.',
                shortDescription: 'Build mobile apps for iOS and Android with React Native',
                category: 'Mobile Development',
                level: 'Intermediate',
                price: 999,
                instructorName: 'Mike Johnson',
                rating: 4.7,
                enrolledCount: 8930,
                totalDuration: 39600, // 11 hours
                totalLessons: 124,
                lessons: [
                    { title: 'React Native Setup and Introduction', duration: 360, order: 1 },
                    { title: 'Components and Props', duration: 480, order: 2 },
                    { title: 'State Management', duration: 540, order: 3 },
                    { title: 'Navigation and Routing', duration: 420, order: 4 },
                    { title: 'Working with APIs', duration: 600, order: 5 }
                ],
                whatYouLearn: [
                    'Build iOS and Android apps with one codebase',
                    'Master React Native components and APIs',
                    'Implement navigation and state management',
                    'Work with device features and APIs',
                    'Deploy apps to app stores'
                ],
                requirements: [
                    'React.js knowledge required',
                    'JavaScript ES6+ understanding',
                    'Basic mobile app concepts'
                ]
            },
            {
                title: 'UI/UX Design Fundamentals',
                description: 'Learn the principles of user interface and user experience design. Master design thinking, prototyping, and modern design tools.',
                shortDescription: 'Master UI/UX design principles and tools',
                category: 'Design',
                level: 'Beginner',
                price: 599,
                instructorName: 'Emily Davis',
                rating: 4.6,
                enrolledCount: 12450,
                totalDuration: 28800, // 8 hours
                totalLessons: 98,
                lessons: [
                    { title: 'Introduction to Design Thinking', duration: 360, order: 1 },
                    { title: 'Color Theory and Typography', duration: 420, order: 2 },
                    { title: 'Layout and Composition', duration: 480, order: 3 },
                    { title: 'Prototyping with Figma', duration: 540, order: 4 },
                    { title: 'User Research and Testing', duration: 360, order: 5 }
                ],
                whatYouLearn: [
                    'Understand design thinking principles',
                    'Master color theory and typography',
                    'Create effective layouts and compositions',
                    'Build interactive prototypes',
                    'Conduct user research and testing'
                ],
                requirements: [
                    'No design experience needed',
                    'Creative mindset',
                    'Access to design software (free options available)'
                ]
            },
            {
                title: 'Digital Marketing Complete Course',
                description: 'Learn digital marketing strategies including SEO, social media marketing, content marketing, email marketing, and paid advertising.',
                shortDescription: 'Complete digital marketing bootcamp',
                category: 'Marketing',
                level: 'Beginner',
                price: 499,
                instructorName: 'Alex Thompson',
                rating: 4.5,
                enrolledCount: 18760,
                totalDuration: 32400, // 9 hours
                totalLessons: 112,
                lessons: [
                    { title: 'Digital Marketing Overview', duration: 300, order: 1 },
                    { title: 'Search Engine Optimization (SEO)', duration: 540, order: 2 },
                    { title: 'Social Media Marketing', duration: 480, order: 3 },
                    { title: 'Content Marketing Strategy', duration: 420, order: 4 },
                    { title: 'Email Marketing Campaigns', duration: 360, order: 5 }
                ],
                whatYouLearn: [
                    'Master SEO and get websites ranked',
                    'Create effective social media campaigns',
                    'Develop content marketing strategies',
                    'Build email marketing funnels',
                    'Run profitable paid advertising campaigns'
                ],
                requirements: [
                    'Basic computer skills',
                    'Understanding of internet and social media',
                    'Marketing interest (no experience needed)'
                ]
            }
        ];

        // Update or create courses
        for (const courseData of courseUpdates) {
            const existingCourse = await Course.findOne({ title: courseData.title });
            
            const coursePayload = {
                ...courseData,
                instructor: instructor._id,
                status: 'published',
                isPublished: true,
                isApproved: true,
                sections: [{
                    title: 'Course Introduction',
                    order: 1,
                    lessons: courseData.lessons.map((lesson, index) => ({
                        ...lesson,
                        order: index + 1
                    }))
                }]
            };

            if (existingCourse) {
                await Course.findByIdAndUpdate(existingCourse._id, coursePayload);
                console.log(`Updated course: ${courseData.title}`);
            } else {
                await Course.create(coursePayload);
                console.log(`Created course: ${courseData.title}`);
            }
        }

        console.log('✅ Course data updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating course data:', error);
        process.exit(1);
    }
};

updateCourseData();
