const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const findDbWithCourses = async () => {
    const dbs = await mongoose.connection.db.admin().listDatabases();
    for (const dbInfo of dbs.databases) {
        const db = mongoose.connection.useDb(dbInfo.name);
        const collections = await db.db.listCollections().toArray();
        const names = collections.map(c => c.name);
        console.log(`DB: ${dbInfo.name}, Collections: ${names.join(', ')}`);

        if (names.includes('courses')) {
            const count = await db.collection('courses').countDocuments();
            console.log(`---> FOUND courses in ${dbInfo.name}: ${count}`);
            if (count > 0) {
                // Update them!
                const updates = [
                    { regex: /Neural/i, thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800' },
                    { regex: /NLP/i, thumb: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800' }
                ];
                for (const up of updates) {
                    await db.collection('courses').findOneAndUpdate({ title: up.regex }, { $set: { thumbnail: up.thumb } });
                }
                console.log('✅ Updated courses in ' + dbInfo.name);
            }
        }
    }
};

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
}).then(async () => {
    console.log('✅ Connected to Atlas');
    await findDbWithCourses();
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
