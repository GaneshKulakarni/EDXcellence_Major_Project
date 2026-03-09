const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User.model');

dotenv.config({ path: path.join(__dirname, '.env') });

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const adminEmail = 'admin@learnhub.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
            console.log('✅ Admin password updated to "admin123"');
        } else {
            const admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin',
                headline: 'Platform Administrator',
                bio: 'Managing the LearnHub ecosystem.'
            });
            await admin.save();
            console.log('✅ Admin user created successfully!');
            console.log('Email: admin@learnhub.com');
            console.log('Password: admin123');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
