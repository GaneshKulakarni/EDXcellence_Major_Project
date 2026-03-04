import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Users } from 'lucide-react';

export default function CourseStudentsPage() {
    const { id } = useParams();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/enrollments/course/${id}`)
            .then(({ data }) => setEnrollments(data.enrollments || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">Course Students</h1>
                <p className="page-subtitle">{enrollments.length} students enrolled</p>
            </div>
            <div className="card">
                {loading ? (
                    <div style={{ padding: '24px' }}>
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '52px', marginBottom: '8px', borderRadius: '8px' }} />)}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="empty-state" style={{ padding: '60px' }}>
                        <div className="empty-icon"><Users size={28} /></div>
                        <div className="empty-title">No students yet</div>
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Enrolled</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map(e => (
                                    <tr key={e._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>
                                                    {e.student?.avatar ? <img src={e.student.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /> : e.student?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{e.student?.name}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{e.student?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(e.enrolledAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="progress-bar" style={{ width: '100px' }}>
                                                    <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)' }}>{e.progress}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            {e.isCompleted
                                                ? <span className="badge badge-success">Completed</span>
                                                : e.progress > 0
                                                    ? <span className="badge badge-warning">In Progress</span>
                                                    : <span className="badge badge-gray">Not Started</span>
                                            }
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
