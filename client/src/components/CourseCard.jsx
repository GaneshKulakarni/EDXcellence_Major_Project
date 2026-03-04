import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen } from 'lucide-react';

export default function CourseCard({ course, showProgress = false, progress = 0 }) {
    const formatDuration = (secs) => {
        if (!secs) return '';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const levelColors = {
        'Beginner': { bg: '#d1fae5', color: '#065f46' },
        'Intermediate': { bg: '#fef3c7', color: '#92400e' },
        'Advanced': { bg: '#fee2e2', color: '#991b1b' },
        'All Levels': { bg: '#dbeafe', color: '#1e40af' },
    };
    const lvlStyle = levelColors[course.level] || levelColors['All Levels'];

    return (
        <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
            <div className="course-card">
                {/* Thumbnail */}
                <div className="course-card-thumb">
                    {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)', fontSize: '3rem' }}>
                            📚
                        </div>
                    )}
                    {/* Level badge */}
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: lvlStyle.bg, color: lvlStyle.color,
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.04em'
                    }}>
                        {course.level}
                    </div>
                    {course.price === 0 && (
                        <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: 'var(--success)', color: 'white',
                            padding: '3px 10px', borderRadius: '20px',
                            fontSize: '0.68rem', fontWeight: '700'
                        }}>FREE</div>
                    )}
                </div>

                {/* Body */}
                <div className="course-card-body">
                    {/* Category */}
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {course.category}
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontWeight: '700', fontSize: '0.9rem', lineHeight: '1.4',
                        marginBottom: '8px', color: 'var(--text-primary)',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                        {course.title}
                    </h3>

                    {/* Instructor */}
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.6rem', fontWeight: '700', flexShrink: 0
                        }}>
                            {course.instructor?.name?.charAt(0)}
                        </div>
                        {course.instructor?.name}
                    </div>

                    {/* Rating */}
                    {course.rating > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#d97706' }}>{course.rating}</span>
                            <div style={{ display: 'flex', gap: '1px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={12}
                                        fill={i <= Math.round(course.rating) ? '#fbbf24' : 'none'}
                                        color={i <= Math.round(course.rating) ? '#fbbf24' : '#d1d5db'}
                                    />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({course.ratingCount})</span>
                        </div>
                    )}

                    {/* Progress bar (for student's enrolled courses) */}
                    {showProgress && (
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Progress</span>
                                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--primary)' }}>{progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="course-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <BookOpen size={11} /> {course.totalLessons || 0} lessons
                            </span>
                            {course.totalDuration > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Clock size={11} /> {formatDuration(course.totalDuration)}
                                </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Users size={11} /> {course.enrolledCount || 0}
                            </span>
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: course.price === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                            {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
