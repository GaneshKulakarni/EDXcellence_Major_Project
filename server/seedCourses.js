const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course.model');
const User = require('./models/User.model');

// Load environment variables
dotenv.config();

const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music'
];

const courseData = {
    'Web Development': [
        { title: 'React for Beginners', description: 'Learn React from scratch and build modern web applications.', instructorName: 'John Smith', duration: 10 * 3600, lessons: 42, price: 0, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop' },
        { title: 'Advanced Node.js APIs', description: 'Master Node.js and build scalable, secure backend APIs.', instructorName: 'Sarah J.', duration: 15 * 3600, lessons: 55, price: 499, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop' },
        { title: 'Full-Stack MERN Bootcamp', description: 'Become a pro MERN stack developer from zero to hero.', instructorName: 'Mike Tyson', duration: 40 * 3600, lessons: 120, price: 999, level: 'All Levels', thumbUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop' },
        { title: 'Tailwind CSS Mastery', description: 'Build stunning modern websites faster than ever with Tailwind.', instructorName: 'Jane Doe', duration: 6 * 3600, lessons: 28, price: 199, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop' },
        { title: 'Next.js Production Apps', description: 'Learn to build production-ready SSR apps with Next.js.', instructorName: 'Vercel Expert', duration: 12 * 3600, lessons: 45, price: 599, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop' }
    ],
    'Mobile Development': [
        { title: 'Flutter & Dart - The Complete Guide', description: 'Build iOS and Android apps with a single codebase using Flutter.', instructorName: 'Max M.', duration: 25 * 3600, lessons: 85, price: 499, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1617042375876-a13e36734a04?q=80&w=800&auto=format&fit=crop' },
        { title: 'React Native for Starters', description: 'Use your React skills to build native mobile apps.', instructorName: 'John Smith', duration: 10 * 3600, lessons: 38, price: 0, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop' },
        { title: 'SwiftUI Masterclass', description: 'Learn Swift and SwiftUI to build premium iOS apps.', instructorName: 'Apple Master', duration: 20 * 3600, lessons: 60, price: 799, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop' },
        { title: 'Android App Dev with Kotlin', description: 'Modern Android development using Kotlin and Jetpack Compose.', instructorName: 'Google Dev', duration: 30 * 3600, lessons: 105, price: 699, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1607252682822-d1bdc8c6a510?q=80&w=800&auto=format&fit=crop' },
        { title: 'Mobile UI/UX Principles', description: 'Design beautiful and user-friendly mobile interfaces.', instructorName: 'Emma T.', duration: 8 * 3600, lessons: 25, price: 299, level: 'All Levels', thumbUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop' }
    ],
    'Data Science': [
        { title: 'Python for Data Analysis', description: 'Master Python, Pandas, and Matplotlib for data insights.', instructorName: 'Dr. Sarah Wilson', duration: 20 * 3600, lessons: 75, price: 499, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=800&auto=format&fit=crop' },
        { title: 'Pandas & NumPy Masterclass', description: 'Deep dive into Python data structures and libraries.', instructorName: 'Michael Chen', duration: 12 * 3600, lessons: 40, price: 299, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
        { title: 'Data Visualization with Power BI', description: 'Build stunning business dashboards and reports.', instructorName: 'Business Intelligence Pro', duration: 10 * 3600, lessons: 35, price: 399, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=800&auto=format&fit=crop' },
        { title: 'Statistics for Data Science', description: 'The math behind data science explained simply.', instructorName: 'Prof. Stats', duration: 15 * 3600, lessons: 50, price: 199, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop' },
        { title: 'Data Science Project Bootcamp', description: 'Build a portfolio of 10 real-world data projects.', instructorName: 'Dr. Sarah Wilson', duration: 50 * 3600, lessons: 150, price: 1299, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1504868584819-f8e90526354c?q=80&w=800&auto=format&fit=crop' }
    ],
    'Machine Learning': [
        { title: 'Machine Learning with Python', description: 'Learn Scikit-Learn, Regression, Classification, and more.', instructorName: 'Michael Chen', duration: 24 * 3600, lessons: 80, price: 599, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop' },
        { title: 'Deep Learning Fundamentals', description: 'Introduction to Neural Networks and Deep Learning.', instructorName: 'Michael Chen', duration: 18 * 3600, lessons: 65, price: 499, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop' },
        { title: 'Neural Networks from Scratch', description: 'Understand the math and code behind neurons.', instructorName: 'Dr. Sarah Wilson', duration: 10 * 3600, lessons: 45, price: 0, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=800&auto=format&fit=crop' },
        { title: 'Computer Vision with OpenCV', description: 'How computers see and understand images.', instructorName: 'Vision Expert', duration: 15 * 3600, lessons: 55, price: 699, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop' },
        { title: 'NLP with Transformers', description: 'The modern way to handle text and language.', instructorName: 'NLP Pro', duration: 12 * 3600, lessons: 40, price: 799, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop' }
    ],
    'DevOps': [
        { title: 'Docker & Kubernetes Bootcamp', description: 'Master containerization and orchestration.', instructorName: 'Alex Rivera', duration: 25 * 3600, lessons: 90, price: 699, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1605752683092-7a3c1a2e7c0b?q=80&w=800&auto=format&fit=crop' },
        { title: 'CI/CD with GitHub Actions', description: 'Automate your workflow from commit to deploy.', instructorName: 'Sarah J.', duration: 8 * 3600, lessons: 25, price: 299, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1618401471353-b98aadebc25b?q=80&w=800&auto=format&fit=crop' },
        { title: 'Terraform for Beginners', description: 'Infrastructure as Code for real-world projects.', instructorName: 'Alex Rivera', duration: 10 * 3600, lessons: 30, price: 399, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop' },
        { title: 'Linux for DevOps Engineers', description: 'Practical command line skills for servers.', instructorName: 'SysAdmin Mike', duration: 12 * 3600, lessons: 50, price: 0, level: 'All Levels', thumbUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop' },
        { title: 'AWS DevOps Essentials', description: 'Introduction to AWS tools for DevOps.', instructorName: 'Cloud Guru', duration: 20 * 3600, lessons: 70, price: 899, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop' }
    ],
    'Design': [
        { title: 'UI/UX Design Masterclass', description: 'Learn the principles of user-centric design.', instructorName: 'Emma Thompson', duration: 15 * 3600, lessons: 60, price: 499, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop' },
        { title: 'Figma for Modern UI', description: 'Master Figma and build rapid prototypes.', instructorName: 'Alex Moore', duration: 10 * 3600, lessons: 40, price: 199, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop' },
        { title: 'Graphic Design Basics', description: 'Foundations of typography, color, and layout.', instructorName: 'Creative Mike', duration: 12 * 3600, lessons: 45, price: 0, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop' },
        { title: 'Adobe Illustrator Vector Art', description: 'Learn to create professional logos and icons.', instructorName: 'Vector Expert', duration: 20 * 3600, lessons: 75, price: 599, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop' },
        { title: 'Product Design Strategy', description: 'Think like a product designer and solve problems.', instructorName: 'Emma Thompson', duration: 10 * 3600, lessons: 35, price: 699, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop' }
    ],
    'Business': [
        { title: 'Product Management 101', description: 'The fundamentals of being a great PM.', instructorName: 'Product VP', duration: 10 * 3600, lessons: 35, price: 499, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop' },
        { title: 'Entrepreneurship Mastery', description: 'How to start and scale your own business.', instructorName: 'Serial Founder', duration: 20 * 3600, lessons: 60, price: 799, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop' },
        { title: 'Financial Intelligence for Leaders', description: 'Understand numbers that drive your company.', instructorName: 'CFO Mark', duration: 8 * 3600, lessons: 25, price: 399, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e41b?q=80&w=800&auto=format&fit=crop' },
        { title: 'Effective Communication', description: 'Master public speaking and leadership talks.', instructorName: 'Coach Anna', duration: 6 * 3600, lessons: 20, price: 0, level: 'All Levels', thumbUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop' },
        { title: 'Negotiation Skills Bootcamp', description: 'Win every deal with proven techniques.', instructorName: 'Deal Closer', duration: 5 * 3600, lessons: 15, price: 299, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?q=80&w=800&auto=format&fit=crop' }
    ],
    'Marketing': [
        { title: 'Digital Marketing Masterclass', description: 'Learn SEO, SEM, and Content Marketing.', instructorName: 'Marketing Pro', duration: 25 * 3600, lessons: 80, price: 599, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
        { title: 'SEO Bootcamp', description: 'The ultimate guide to ranking #1 on Google.', instructorName: 'Search Expert', duration: 12 * 3600, lessons: 40, price: 399, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20a?q=80&w=800&auto=format&fit=crop' },
        { title: 'Social Media Management', description: 'Build your brand on TikTok, IG, and Twitter.', instructorName: 'Influencer Guru', duration: 10 * 3600, lessons: 35, price: 199, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop' },
        { title: 'Facebook Ads Mastery', description: 'Scale your business with paid advertising.', instructorName: 'Ads Expert', duration: 15 * 3600, lessons: 50, price: 499, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop' },
        { title: 'Email Marketing Secrets', description: 'Turn leads into customers with automation.', instructorName: 'Email Pro', duration: 8 * 3600, lessons: 30, price: 0, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=800&auto=format&fit=crop' }
    ],
    'Photography': [
        { title: 'Photography Fundamentals', description: 'Master your camera and lighting.', instructorName: 'Lens Master', duration: 10 * 3600, lessons: 40, price: 499, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1542038783-0ad442d7da69?q=80&w=800&auto=format&fit=crop' },
        { title: 'Lightroom Classic Masterclass', description: 'Professional editing for your photos.', instructorName: 'Editor Joe', duration: 12 * 3600, lessons: 45, price: 299, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1542038783-0ad442d7da69?q=80&w=800&auto=format&fit=crop' },
        { title: 'Street Photography Basics', description: 'Capturing moments in the concrete jungle.', instructorName: 'Urban Eye', duration: 8 * 3600, lessons: 30, price: 199, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop' },
        { title: 'Portrait Photography Secrets', description: 'How to take stunning headshots and portraits.', instructorName: 'Portrait Pro', duration: 15 * 3600, lessons: 55, price: 599, level: 'Advanced', thumbUrl: 'https://images.unsplash.com/photo-1542038783-0ad442d7da69?q=80&w=800&auto=format&fit=crop' },
        { title: 'Mobile Photography Pro', description: 'Take world-class photos with your phone.', instructorName: 'Phone Photographer', duration: 5 * 3600, lessons: 20, price: 0, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop' }
    ],
    'Music': [
        { title: 'Music Production Masterclass', description: 'Produce professional tracks in Ableton.', instructorName: 'Beat Maker', duration: 20 * 3600, lessons: 70, price: 699, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop' },
        { title: 'Piano for Beginners', description: 'Learn to play your favorite songs fast.', instructorName: 'Piano Pro', duration: 15 * 3600, lessons: 60, price: 399, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop' },
        { title: 'Guitar Mastery Bootcamp', description: 'From first chords to solo brilliance.', instructorName: 'Guitar Hero', duration: 18 * 3600, lessons: 65, price: 0, level: 'Beginner', thumbUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop' },
        { title: 'Vocal Coaching Masterclass', description: 'Unlock the power of your singing voice.', instructorName: 'Voice Expert', duration: 12 * 3600, lessons: 40, price: 499, level: 'Intermediate', thumbUrl: 'https://images.unsplash.com/photo-1460039230329-eb072f4721cc?q=80&w=800&auto=format&fit=crop' },
        { title: 'Music Theory Explained', description: 'The foundations of melody and harmony.', instructorName: 'Theory Guru', duration: 10 * 3600, lessons: 35, price: 299, level: 'All Levels', thumbUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop' }
    ]
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // 1. Create a dummy instructor if none exists
        let instructor = await User.findOne({ role: 'instructor' });
        if (!instructor) {
            instructor = await User.create({
                name: 'Elite Instructor',
                email: 'instructor@learnhub.com',
                password: 'password123',
                role: 'instructor',
                headline: 'Professional Educator & Industry Expert',
                bio: 'Passionate about teaching and empowering students with industry-relevant skills.'
            });
            console.log('✅ Created dummy instructor');
        }

        let coursesCreated = 0;

        for (const category of Object.keys(courseData)) {
            const courses = courseData[category];
            for (const c of courses) {
                // Check if course already exists
                const existing = await Course.findOne({ title: c.title });
                if (existing) {
                    console.log(`⏩ Skipping existing course: ${c.title}`);
                    continue;
                }

                // Prepare course object
                const course = new Course({
                    title: c.title,
                    description: c.description,
                    shortDescription: c.description.substring(0, 100) + '...',
                    category: category,
                    instructor: instructor._id,
                    rating: parseFloat((Math.random() * (5.0 - 4.2) + 4.2).toFixed(1)),
                    ratingCount: Math.floor(Math.random() * 5000) + 100,
                    enrolledCount: Math.floor(Math.random() * 25000) + 500,
                    level: c.level,
                    price: c.price,
                    isFree: c.price === 0,
                    thumbnail: c.thumbUrl,
                    status: 'published',
                    isPublished: true,
                    isApproved: true,
                    sections: [
                        {
                            title: 'Introduction',
                            order: 1,
                            lessons: [
                                {
                                    title: 'Welcome to the course',
                                    description: 'Introduction and overview',
                                    order: 1,
                                    duration: 300 // 5 mins
                                }
                            ]
                        }
                    ],
                    totalLessons: c.lessons,
                    totalDuration: c.duration,
                    language: 'English'
                });

                await course.save();

                // Overwrite the calculated values with our dummy values after saving, 
                // because the pre-save hook recalculates based on actual lesson subdocuments.
                await Course.findByIdAndUpdate(course._id, {
                    totalDuration: c.duration,
                    totalLessons: c.lessons
                });

                coursesCreated++;
                console.log(`✅ Seeded: ${c.title}`);
            }
        }

        console.log(`\n🎉 Seeding complete! Created ${coursesCreated} courses.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
