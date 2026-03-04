import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import CourseCard from '../../components/CourseCard';
import { BookOpen, Filter } from 'lucide-react';

export default function MyCoursesPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | inProgress | completed

    useEffect(() => {
        api.get('/enrollments/my')
            .then(({ data }) => setEnrollments(data.enrollments || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = enrollments.filter(e => {
        if (filter === 'inProgress') return !e.isCompleted;
        if (filter === 'completed') return e.isCompleted;
        return true;
    });

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">My Courses</h1>
                <p className="page-subtitle">{enrollments.length} courses enrolled</p>
            </div>

            {/* Filter tabs */}
            <div className="tabs" style={{ marginBottom: '24px' }}>
                {[
                    { key: 'all', label: `All Courses (${enrollments.length})` },
                    { key: 'inProgress', label: `In Progress (${enrollments.filter(e => !e.isCompleted).length})` },
                    { key: 'completed', label: `Completed (${enrollments.filter(e => e.isCompleted).length})` },
                ].map(t => (
                    <button key={t.key} className={`tab ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="courses-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div className="skeleton" style={{ height: '180px' }} />
                            <div style={{ padding: '16px' }}>
                                <div className="skeleton" style={{ height: '14px', marginBottom: '8px' }} />
                                <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><BookOpen size={32} /></div>
                    <div className="empty-title">{filter === 'all' ? 'No enrolled courses' : `No ${filter === 'completed' ? 'completed' : 'in-progress'} courses`}</div>
                    <p className="empty-desc">Start learning by exploring our course catalog</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                </div>
            ) : (
                <div className="courses-grid">
                    {filtered.map(enrollment => (
                        <CourseCard
                            key={enrollment._id}
                            course={enrollment.course}
                            showProgress={true}
                            progress={enrollment.progress}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
