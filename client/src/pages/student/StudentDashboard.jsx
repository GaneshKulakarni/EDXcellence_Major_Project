import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import { BookOpen, TrendingUp, Award, Clock, ArrowRight, Play, Star } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/enrollments/my');
                setEnrollments(data.enrollments || []);
            } catch { }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const completed = enrollments.filter(e => e.isCompleted).length;
    const inProgress = enrollments.filter(e => !e.isCompleted && e.progress > 0).length;
    const avgProgress = enrollments.length
        ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
        : 0;

    const recentEnrollments = [...enrollments].sort((a, b) => new Date(b.lastAccessedAt || b.enrolledAt) - new Date(a.lastAccessedAt || a.enrolledAt)).slice(0, 4);

    const stats = [
        { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: '#6366f1', bg: '#eef2ff' },
        { label: 'Completed', value: completed, icon: Award, color: '#10b981', bg: '#d1fae5' },
        { label: 'In Progress', value: inProgress, icon: TrendingUp, color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Avg. Progress', value: `${avgProgress}%`, icon: Clock, color: '#06b6d4', bg: '#cffafe' },
    ];

    return (
        <div className="page-content">
            {/* Header */}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="page-subtitle">Continue your learning journey — you're doing great!</p>
                    </div>
                    <Link to="/courses" className="btn btn-primary">
                        <BookOpen size={16} /> Browse Courses
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {stats.map(stat => (
                    <div key={stat.label} className="stat-card">
                        <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Courses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Continue Learning</h2>
                        <Link to="/student/courses" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                    <div className="skeleton" style={{ width: '80px', height: '60px', borderRadius: '8px', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton" style={{ height: '14px', marginBottom: '8px' }} />
                                        <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentEnrollments.length === 0 ? (
                        <div className="empty-state" style={{ padding: '40px 20px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                            <div className="empty-icon"><BookOpen size={28} /></div>
                            <div className="empty-title">No courses yet</div>
                            <p className="empty-desc">Start learning by browsing our course catalog</p>
                            <Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {recentEnrollments.map(enrollment => (
                                <Link key={enrollment._id} to={`/learn/${enrollment.course?._id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex', gap: '16px', padding: '16px', background: 'white',
                                        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                                        transition: 'var(--transition)', cursor: 'pointer'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        {/* Thumbnail */}
                                        <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: 'var(--gradient-primary)', flexShrink: 0 }}>
                                            {enrollment.course?.thumbnail
                                                ? <img src={enrollment.course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📚</div>
                                            }
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                                                {enrollment.course?.title}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                                {enrollment.course?.instructor?.name}
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${enrollment.progress}%` }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{enrollment.progress}% complete</span>
                                                {enrollment.isCompleted && <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: '600' }}>✓ Completed</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                <Play size={16} style={{ marginLeft: '2px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Progress Summary */}
                    <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)', padding: '24px', color: 'white' }}>
                        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1rem', fontWeight: '700' }}>Your Learning Goal</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                <svg width="80" height="80" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="8"
                                        strokeDasharray={`${2 * Math.PI * 32}`}
                                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - avgProgress / 100)}`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 40 40)"
                                    />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>
                                    {avgProgress}%
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Average Progress</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                                    {completed} of {enrollments.length} courses completed
                                </div>
                                {enrollments.length > 0 && (
                                    <div style={{ marginTop: '8px', fontSize: '0.75rem', opacity: 0.9, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>
                                        🔥 Keep it up!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px' }}>
                        <h3 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '16px' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { label: '🔍 Browse New Courses', href: '/courses' },
                                { label: '📚 My Courses', href: '/student/courses' },
                                { label: '👤 Edit Profile', href: '/student/profile' },
                            ].map(action => (
                                <Link key={action.label} to={action.href} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)', color: 'var(--text-primary)',
                                    fontSize: '0.85rem', fontWeight: '500', transition: 'var(--transition)',
                                    textDecoration: 'none'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-bg)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                >
                                    {action.label}
                                    <ArrowRight size={14} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
