const mongoose = require('mongoose');
require('dotenv').config();

const directUri = process.env.ATLAS_URI;

mongoose.connect(directUri, { serverSelectionTimeoutMS: 15000 })
    .then(async () => {
        console.log('✅ Connected direct to Atlas');
        const db = mongoose.connection.useDb('test'); // Check test
        const count = await db.collection('courses').countDocuments();
        console.log('Courses in test:', count);

        let targetDb = db;
        if (count === 0) {
            console.log('Checking LearnHub DB...');
            targetDb = mongoose.connection.useDb('learnhub');
            console.log('Courses in learnhub:', await targetDb.collection('courses').countDocuments());
        }

        const updates = [
            { regex: /Neural/i, thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800' },
            { regex: /NLP/i, thumb: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800' }
        ];

        for (const up of updates) {
            const res = await targetDb.collection('courses').findOneAndUpdate(
                { title: up.regex },
                { $set: { thumbnail: up.thumb } }
            );
            if (res) console.log(`🚀 Updated matching: ${up.regex}`);
            else console.warn(`⚠️ NO MATCH for regex: ${up.regex}`);
        }

        // Also fix any empty ones
        const emptyRes = await targetDb.collection('courses').updateMany(
            { $or: [{ thumbnail: '' }, { thumbnail: null }] },
            { $set: { thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800' } }
        );
        console.log(`🖼️ Fixed empty thumbnails:`, emptyRes.modifiedCount);

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
