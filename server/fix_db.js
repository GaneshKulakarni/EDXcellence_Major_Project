const db = db.getSiblingDB('learnhub');
db.courses.updateOne(
    { title: /NLP with Transformers/i },
    { $set: { thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800' } }
);
db.courses.updateOne(
    { title: /Neural Networks from Scratch/i },
    { $set: { thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800' } }
);
print('🚀 Updated 2 ML courses!');
// Also fix empty ones
const res = db.courses.updateMany(
    { $or: [{ thumbnail: '' }, { thumbnail: null }] },
    { $set: { thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800' } }
);
print('🚀 Fixed ' + res.modifiedCount + ' empty thumbnails!');
