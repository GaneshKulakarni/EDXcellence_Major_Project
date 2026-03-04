import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import {
    Star, Users, Clock, BookOpen, Award, Play,
    ChevronDown, ChevronUp, Check, Globe, BarChart3,
    Lock, Unlock
} from 'lucide-react';

function StarRating({ rating, size = 16 }) {
    return (
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={size} fill={i <= Math.round(rating) ? '#fbbf24' : 'none'} color={i <= Math.round(rating) ? '#fbbf24' : '#d1d5db'} />
            ))}
        </div>
    );
}

export default function CourseDetailPage() {
    const { id } = useParams();
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, reviewsRes] = await Promise.all([
                    api.get(`/courses/${id}`),
                    api.get(`/reviews/${id}`)
                ]);
                setCourse(courseRes.data.course);
                setIsEnrolled(courseRes.data.isEnrolled);
                setReviews(reviewsRes.data.reviews || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleEnroll = async () => {
        if (!token) { navigate('/login'); return; }
        setEnrolling(true);
        try {
            await api.post(`/enrollments/${id}`);
            setIsEnrolled(true);
            toast.success('🎉 Enrolled successfully!');
            navigate(`/learn/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const formatDuration = (secs) => {
        if (!secs) return '0m';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (loading) return (
        <div className="loading-page">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Loading course...</p>
        </div>
    );

    if (!course) return (
        <div className="empty-state" style={{ padding: '100px 20px' }}>
            <div className="empty-title">Course not found</div>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
    );

    const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Course Header */}
            <div style={{ background: '#0f172a', padding: '48px 0 32px', color: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
                        {/* Left */}
                        <div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <span className="badge badge-primary">{course.category}</span>
                                <span className="badge badge-gray">{course.level}</span>
                                {course.isFree && <span className="badge badge-success">Free</span>}
                            </div>

                            <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.3' }}>
                                {course.title}
                            </h1>

                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: '20px', lineHeight: '1.7' }}>
                                {course.shortDescription || course.description?.slice(0, 200)}...
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                {course.rating > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ color: '#fbbf24', fontWeight: '700' }}>{course.rating}</span>
                                        <StarRating rating={course.rating} />
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                                            ({course.ratingCount} ratings)
                                        </span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    <Users size={14} style={{ marginRight: '4px' }} />
                                    {course.enrolledCount?.toLocaleString()} students
                                </div>
                            </div>

                            {/* Instructor */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>
                                    {course.instructor?.avatar
                                        ? <img src={course.instructor.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                        : course.instructor?.name?.charAt(0)
                                    }
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Created by </span>
                                    <Link to={`/instructor/${course.instructor?._id}`} style={{ color: '#818cf8', fontWeight: '600', fontSize: '0.9rem' }}>
                                        {course.instructor?.name}
                                    </Link>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Globe size={13} /> {course.language}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <BookOpen size={13} /> {totalLessons} lessons
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={13} /> {formatDuration(course.totalDuration)}
                                </span>
                            </div>
                        </div>

                        {/* Course card */}
                        <div style={{
                            background: 'white', borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            position: 'sticky', top: '80px'
                        }}>
                            {/* Thumbnail */}
                            <div style={{ aspectRatio: '16/9', background: 'var(--gradient-primary)', position: 'relative', overflow: 'hidden' }}>
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📚</div>
                                )}
                                {(course.previewVideo || course.sections?.[0]?.lessons?.[0]?.videoUrl) && (
                                    <div style={{
                                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(0,0,0,0.3)', cursor: 'pointer'
                                    }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                            <Play size={24} color="var(--primary)" style={{ marginLeft: '3px' }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '24px' }}>
                                {/* Price */}
                                <div style={{ marginBottom: '20px' }}>
                                    {course.price === 0 ? (
                                        <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>Free</span>
                                    ) : (
                                        <div>
                                            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                                ₹{course.price?.toLocaleString()}
                                            </span>
                                            {course.discount > 0 && (
                                                <span className="badge badge-error" style={{ marginLeft: '8px' }}>{course.discount}% OFF</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                {isEnrolled ? (
                                    <Link to={`/learn/${id}`} className="btn btn-success w-full btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                                        <Play size={18} /> Continue Learning
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%' }}
                                    >
                                        {enrolling ? 'Enrolling...' : course.price === 0 ? '🚀 Enroll for Free' : '💳 Enroll Now'}
                                    </button>
                                )}

                                {/* Course includes */}
                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>This course includes:</div>
                                    {[
                                        { icon: <Clock size={15} />, text: `${formatDuration(course.totalDuration)} of on-demand video` },
                                        { icon: <BookOpen size={15} />, text: `${totalLessons} lessons` },
                                        { icon: <Award size={15} />, text: 'Certificate of completion' },
                                        { icon: <Globe size={15} />, text: 'Full lifetime access' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content Tabs */}
            <div className="container" style={{ padding: '40px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
                    {/* Left - Content */}
                    <div>
                        {/* Tabs */}
                        <div className="tabs" style={{ marginBottom: '28px' }}>
                            {['overview', 'curriculum', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                            ))}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="animate-fade-in">
                                {/* What you'll learn */}
                                {course.whatYouLearn?.length > 0 && (
                                    <div style={{ background: 'var(--primary-bg)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '28px' }}>
                                        <h3 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '1.1rem' }}>What you'll learn</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            {course.whatYouLearn.map((item, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.875rem' }}>
                                                    <Check size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div style={{ marginBottom: '28px' }}>
                                    <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>Course Description</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>
                                        {course.description}
                                    </p>
                                </div>

                                {/* Requirements */}
                                {course.requirements?.length > 0 && (
                                    <div style={{ marginBottom: '28px' }}>
                                        <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>Requirements</h3>
                                        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {course.requirements.map((req, i) => (
                                                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Curriculum Tab */}
                        {activeTab === 'curriculum' && (
                            <div className="animate-fade-in">
                                <h3 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '1.1rem' }}>
                                    Course Curriculum · {totalLessons} lessons
                                </h3>
                                {course.sections?.map((section, si) => (
                                    <div key={si} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '8px', overflow: 'hidden' }}>
                                        <button
                                            onClick={() => setExpandedSections(prev => ({ ...prev, [si]: !prev[si] }))}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '14px 16px', background: 'var(--bg)', border: 'none', cursor: 'pointer',
                                                fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)'
                                            }}
                                        >
                                            <span>{section.title}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                                                    {section.lessons?.length} lessons
                                                </span>
                                                {expandedSections[si] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                        </button>
                                        {expandedSections[si] && (
                                            <div style={{ background: 'white' }}>
                                                {section.lessons?.map((lesson, li) => (
                                                    <div key={li} className="lesson-item" style={{ padding: '12px 16px', paddingLeft: '32px' }}>
                                                        <div style={{ color: lesson.isPreview ? 'var(--primary)' : 'var(--text-muted)' }}>
                                                            {lesson.isPreview ? <Unlock size={15} /> : <Lock size={15} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.875rem', flex: 1 }}>{lesson.title}</span>
                                                        {lesson.isPreview && (
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>Preview</span>
                                                        )}
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                                            {lesson.duration ? `${Math.round(lesson.duration / 60)}m` : ''}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="animate-fade-in">
                                <h3 style={{ fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
                                    Student Reviews · {course.ratingCount || 0}
                                </h3>
                                {/* Average rating */}
                                {course.rating > 0 && (
                                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '28px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>{course.rating}</div>
                                            <StarRating rating={course.rating} size={20} />
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Course Rating</div>
                                        </div>
                                    </div>
                                )}

                                {reviews.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon"><Star size={28} /></div>
                                        <div className="empty-title">No reviews yet</div>
                                        <p className="empty-desc">Be the first to review this course after enrolling.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {reviews.map(review => (
                                            <div key={review._id} style={{ display: 'flex', gap: '16px' }}>
                                                <div className="avatar avatar-md" style={{ background: 'var(--gradient-primary)', flexShrink: 0 }}>
                                                    {review.student?.avatar
                                                        ? <img src={review.student.avatar} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                                                        : review.student?.name?.charAt(0)
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{review.student?.name}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                                                        <StarRating rating={review.rating} size={14} />
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {review.title && <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>{review.title}</div>}
                                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{review.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right - Instructor card */}
                    <div style={{ display: 'none' }}>
                        {/* Hidden on mobile, shown on desktop only (the course card is sticky above) */}
                    </div>
                </div>
            </div>
        </div>
    );
}
