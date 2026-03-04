import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Users, BookOpen, ClipboardList, TrendingUp, Star, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [topCourses, setTopCourses] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(({ data }) => {
                setStats(data.stats);
                setTopCourses(data.topCourses || []);
                setRecentUsers(data.recentUsers || []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#6366f1', bg: '#eef2ff', change: `${stats.students} students, ${stats.instructors} instructors` },
        { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: '#10b981', bg: '#d1fae5', change: `${stats.pendingCourses} pending review` },
        { label: 'Enrollments', value: stats.totalEnrollments, icon: TrendingUp, color: '#f59e0b', bg: '#fef3c7', change: `${stats.recentEnrollments} this month` },
        { label: 'Reviews', value: stats.totalReviews, icon: Star, color: '#f43f5e', bg: '#ffe4e6', change: 'Avg 4.5 ★' },
    ] : [];

    const pieData = stats ? [
        { name: 'Students', value: stats.students },
        { name: 'Instructors', value: stats.instructors },
        { name: 'Admins', value: stats.totalUsers - stats.students - stats.instructors },
    ] : [];

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Platform overview and management center</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {statCards.map(stat => (
                    <div key={stat.label} className="stat-card">
                        <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <div className="stat-value" style={{ color: stat.color }}>{stat.value?.toLocaleString()}</div>
                            <div className="stat-label">{stat.label}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending alert */}
            {stats?.pendingCourses > 0 && (
                <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem' }}>⏳</span>
                        <span style={{ fontWeight: '600', color: '#92400e' }}>
                            {stats.pendingCourses} course{stats.pendingCourses > 1 ? 's' : ''} waiting for review
                        </span>
                    </div>
                    <Link to="/admin/courses?status=pending" className="btn btn-warning btn-sm" style={{ background: '#f59e0b', color: 'white', boxShadow: 'none' }}>
                        Review Now →
                    </Link>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
                {/* Top Courses Chart */}
                <div className="card">
                    <div className="card-header"><h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Top Courses by Enrollment</h3></div>
                    <div className="card-body">
                        {topCourses.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={topCourses.map(c => ({ name: c.title?.slice(0, 20) + '...', students: c.enrolledCount }))}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>
                        )}
                    </div>
                </div>

                {/* User Breakdown Pie */}
                <div className="card">
                    <div className="card-header"><h3 style={{ fontWeight: '700', fontSize: '1rem' }}>User Breakdown</h3></div>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {pieData.map((d, i) => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: CHART_COLORS[i] }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.value?.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users + Top Courses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Recent Users</h3>
                        <Link to="/admin/users" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>View All</Link>
                    </div>
                    <div>
                        {recentUsers.map(user => (
                            <div key={user._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid var(--border-light)' }}>
                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>
                                    {user.avatar ? <img src={user.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /> : user.name?.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                </div>
                                <span className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'instructor' ? 'badge-warning' : 'badge-success'}`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Top Courses</h3>
                        <Link to="/admin/courses" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>View All</Link>
                    </div>
                    <div>
                        {topCourses.map((course, i) => (
                            <div key={course._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: CHART_COLORS[i % 5], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{course.instructor?.name}</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', flexShrink: 0 }}>
                                    {course.enrolledCount} students
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
