const db = db.getSiblingDB('learnhub');
db.courses.updateOne(
    { title: 'Neural Networks from Scratch' },
    { $set: { thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800' } }
);
db.courses.updateOne(
    { title: 'Computer Vision with OpenCV' },
    { $set: { thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800' } }
);
print('🎨 Updated 3rd (and 2nd) card thumbnails!');
