import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Check, ChevronDown, ChevronUp, Play, BookOpen, Award, ArrowLeft } from 'lucide-react';

export default function LearnPage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [progress, setProgress] = useState({ completedLessons: [], progress: 0, isCompleted: false });
    const [expandedSections, setExpandedSections] = useState({ 0: true });
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [review, setReview] = useState({ rating: 5, title: '', comment: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get(`/progress/${courseId}`)
                ]);
                setCourse(courseRes.data.course);
                setEnrollment(courseRes.data.isEnrolled);
                setProgress(progressRes.data);
                // Set first lesson as active
                const firstSection = courseRes.data.course?.sections?.[0];
                if (firstSection?.lessons?.[0]) setActiveLesson(firstSection.lessons[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    const markComplete = async (lessonId) => {
        try {
            const { data } = await api.post(`/progress/${courseId}/lesson/${lessonId}`);
            setProgress(data);
            if (data.isCompleted) {
                toast.success('🎉 Congratulations! Course completed!');
                setShowReviewModal(true);
            } else {
                toast.success('✅ Lesson completed!');
            }
        } catch (err) {
            toast.error('Failed to mark lesson');
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/reviews/${courseId}`, review);
            toast.success('Review submitted! Thank you 🌟');
            setShowReviewModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;

    const isLessonCompleted = (lessonId) => progress.completedLessons?.includes(String(lessonId));

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
            {/* Topbar */}
            <header style={{
                height: '60px', background: '#1e293b', borderBottom: '1px solid #334155',
                display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px',
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <Link to="/student/courses" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                    <ArrowLeft size={16} /> Back
                </Link>
                <div style={{ flex: 1, color: 'white', fontWeight: '600', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {course?.title}
                </div>
                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div className="progress-bar" style={{ width: '120px' }}>
                        <div className="progress-fill" style={{ width: `${progress.progress}%` }} />
                    </div>
                    <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>{progress.progress}%</span>
                </div>
                {progress.hasCertificate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                        <Award size={14} /> Certificate Earned!
                    </div>
                )}
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Video area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Video */}
                    <div style={{ aspectRatio: '16/9', background: '#000', maxHeight: '65vh', width: '100%' }}>
                        {activeLesson?.videoUrl ? (
                            <iframe
                                src={activeLesson.videoUrl.includes('youtube') ? activeLesson.videoUrl.replace('watch?v=', 'embed/') : activeLesson.videoUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allowFullScreen
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play size={36} color="#818cf8" style={{ marginLeft: '4px' }} />
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    {activeLesson ? 'No video for this lesson' : 'Select a lesson to start'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Lesson info */}
                    {activeLesson && (
                        <div style={{ flex: 1, padding: '24px 32px', background: 'white', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '20px' }}>
                                <div>
                                    <h2 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '4px' }}>{activeLesson.title}</h2>
                                    {activeLesson.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{activeLesson.description}</p>}
                                </div>
                                <button
                                    onClick={() => markComplete(activeLesson._id)}
                                    disabled={isLessonCompleted(activeLesson._id)}
                                    className={`btn ${isLessonCompleted(activeLesson._id) ? 'btn-success' : 'btn-primary'}`}
                                    style={{ flexShrink: 0 }}
                                >
                                    {isLessonCompleted(activeLesson._id) ? <><Check size={16} /> Completed</> : 'Mark Complete'}
                                </button>
                            </div>
                            {activeLesson.content && (
                                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>
                                    {activeLesson.content}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar - Curriculum */}
                <div className="lesson-sidebar">
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'white' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>Course Content</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {progress.completedLessons?.length} / {course?.totalLessons} lessons completed
                        </div>
                    </div>

                    {course?.sections?.map((section, si) => (
                        <div key={si}>
                            <button
                                onClick={() => setExpandedSections(prev => ({ ...prev, [si]: !prev[si] }))}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', background: '#f8fafc', border: 'none', cursor: 'pointer',
                                    borderBottom: '1px solid var(--border)', fontWeight: '600', fontSize: '0.8rem',
                                    color: 'var(--text-primary)', textAlign: 'left'
                                }}
                            >
                                {section.title}
                                {expandedSections[si] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            {expandedSections[si] && section.lessons?.map((lesson, li) => {
                                const completed = isLessonCompleted(lesson._id);
                                const isActive = activeLesson?._id === lesson._id;
                                return (
                                    <button
                                        key={li}
                                        onClick={() => setActiveLesson(lesson)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'flex-start', gap: '10px',
                                            padding: '10px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                            background: isActive ? 'var(--primary-bg)' : 'white',
                                            borderBottom: '1px solid var(--border-light)',
                                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                            marginTop: '1px',
                                            background: completed ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {completed ? <Check size={11} color="white" /> : <Play size={8} color="white" style={{ marginLeft: '1px' }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '0.78rem', fontWeight: isActive ? '600' : '400',
                                                color: isActive ? 'var(--primary)' : completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                                lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box',
                                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                            }}>
                                                {lesson.title}
                                            </div>
                                            {lesson.duration > 0 && (
                                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {Math.round(lesson.duration / 60)}m
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '480px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">🌟 Share Your Experience</h3>
                            <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
                        </div>
                        <form onSubmit={submitReview}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label className="form-label">Rating</label>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} type="button" onClick={() => setReview(r => ({ ...r, rating: star }))}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', transition: 'transform 0.1s' }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                {star <= review.rating ? '⭐' : '☆'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Review Title</label>
                                    <input className="form-input" placeholder="Great course!" value={review.title}
                                        onChange={e => setReview(r => ({ ...r, title: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Your Review *</label>
                                    <textarea className="form-input" rows={4} placeholder="Share what you learned and why you'd recommend this course..."
                                        value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} required
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-ghost">Skip</button>
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
