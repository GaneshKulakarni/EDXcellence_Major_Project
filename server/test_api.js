const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/User.model');

dotenv.config();

async function testApi() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    try {
        const user = await User.findOne({ email: new RegExp('ganesh', 'i') }) || await User.findOne();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Test port 5173
        const response = await fetch('http://localhost:5173/api/enrollments/my', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('5173 Status:', response.status);
        console.log('5173 Text:', await response.text());
    } catch (err) {
        console.error('Error:', err);
    }

    mongoose.disconnect();
}
testApi();
