const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
}).then(async () => {
    console.log('✅ Connected to MongoDB');
    const Course = require('./models/Course.model');
    // List ALL courses in the DB to check titles
    const all = await Course.find({}, { title: 1 });
    console.log('Found ' + all.length + ' courses.');
    all.forEach(c => console.log(' - ' + c.title));

    const updates = [
        { regex: /Neural/i, thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800' },
        { regex: /NLP/i, thumb: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800' }
    ];
    for (const up of updates) {
        const res = await Course.findOneAndUpdate({ title: up.regex }, { thumbnail: up.thumb });
        if (res) console.log(`🚀 Updated matching: ${up.regex}`);
        else console.warn(`⚠️ NO MATCH for regex: ${up.regex}`);
    }
    process.exit(0);
}).catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
});
