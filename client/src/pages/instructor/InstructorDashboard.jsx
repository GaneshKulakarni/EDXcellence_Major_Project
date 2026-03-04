import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import { BookOpen, Users, Star, TrendingUp, PlusCircle, ArrowRight, Eye } from 'lucide-react';

export default function InstructorDashboard() {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/courses/instructor/my-courses')
            .then(({ data }) => setCourses(data.courses || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalStudents = courses.reduce((a, c) => a + (c.enrolledCount || 0), 0);
    const avgRating = courses.length
        ? (courses.reduce((a, c) => a + (c.rating || 0), 0) / courses.length).toFixed(1)
        : '0';
    const published = courses.filter(c => c.status === 'published').length;

    const stats = [
        { label: 'Total Courses', value: courses.length, icon: BookOpen, color: '#6366f1', bg: '#eef2ff' },
        { label: 'Total Students', value: totalStudents, icon: Users, color: '#10b981', bg: '#d1fae5' },
        { label: 'Published', value: published, icon: TrendingUp, color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Avg Rating', value: avgRating, icon: Star, color: '#f43f5e', bg: '#ffe4e6' },
    ];

    const statusBadge = (status) => {
        const map = { published: 'badge-success', pending: 'badge-warning', draft: 'badge-gray', rejected: 'badge-error' };
        return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="page-title">Instructor Dashboard</h1>
                        <p className="page-subtitle">Welcome back, {user?.name}! Here's your teaching overview.</p>
                    </div>
                    <Link to="/instructor/courses/create" className="btn btn-primary">
                        <PlusCircle size={16} /> Create Course
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

            {/* Courses Table */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>My Courses</h3>
                    <Link to="/instructor/courses" className="btn btn-ghost btn-sm">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div style={{ padding: '24px' }}>
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '52px', marginBottom: '8px', borderRadius: '8px' }} />)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="empty-state" style={{ padding: '48px 24px' }}>
                        <div className="empty-icon"><BookOpen size={28} /></div>
                        <div className="empty-title">No courses yet</div>
                        <p className="empty-desc">Create your first course to start teaching</p>
                        <Link to="/instructor/courses/create" className="btn btn-primary btn-sm">Create Course</Link>
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.slice(0, 8).map(course => (
                                    <tr key={course._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '44px', height: '32px', borderRadius: '6px', background: 'var(--gradient-primary)', overflow: 'hidden', flexShrink: 0 }}>
                                                    {course.thumbnail ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📚</div>}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.85rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{course.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{statusBadge(course.status)}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                                                <Users size={14} color="var(--text-muted)" />
                                                {course.enrolledCount || 0}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                                                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                                                {course.rating || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link to={`/courses/${course._id}`} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
                                                    <Eye size={14} />
                                                </Link>
                                                <Link to={`/instructor/courses/${course._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
