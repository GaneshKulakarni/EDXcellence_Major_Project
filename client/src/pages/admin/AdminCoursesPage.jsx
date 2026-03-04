import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = statusFilter ? `?status=${statusFilter}` : '';
            const { data } = await api.get(`/admin/courses${params}`);
            setCourses(data.courses || []);
            setTotal(data.total || 0);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCourses(); }, [statusFilter]);

    const approveCourse = async (courseId) => {
        try {
            const { data } = await api.patch(`/admin/courses/${courseId}/approve`, { approved: true });
            setCourses(c => c.map(x => x._id === courseId ? data.course : x));
            toast.success('Course approved and published!');
        } catch { toast.error('Failed to approve course'); }
    };

    const rejectCourse = async () => {
        try {
            const { data } = await api.patch(`/admin/courses/${rejectModal}/approve`, { approved: false, reason: rejectReason });
            setCourses(c => c.map(x => x._id === rejectModal ? data.course : x));
            toast.success('Course rejected');
            setRejectModal(null);
            setRejectReason('');
        } catch { toast.error('Failed to reject course'); }
    };

    const statusBadge = (status) => {
        const map = { published: 'badge-success', pending: 'badge-warning', draft: 'badge-gray', rejected: 'badge-error' };
        return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">Course Management</h1>
                <p className="page-subtitle">{total} courses found</p>
            </div>

            {/* Filter tabs */}
            <div className="tabs" style={{ marginBottom: '24px' }}>
                {[
                    { key: 'pending', label: '⏳ Pending Review' },
                    { key: 'published', label: '✅ Published' },
                    { key: 'rejected', label: '❌ Rejected' },
                    { key: '', label: '📋 All' },
                ].map(t => (
                    <button key={t.key} className={`tab ${statusFilter === t.key ? 'active' : ''}`} onClick={() => setStatusFilter(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="card">
                {loading ? (
                    <div style={{ padding: '24px' }}>
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '52px', marginBottom: '8px', borderRadius: '8px' }} />)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="empty-state" style={{ padding: '60px' }}>
                        <div className="empty-title">No {statusFilter} courses</div>
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Instructor</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '48px', height: '32px', borderRadius: '6px', background: 'var(--gradient-primary)', overflow: 'hidden', flexShrink: 0 }}>
                                                    {course.thumbnail ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📚</div>}
                                                </div>
                                                <div style={{ maxWidth: '200px' }}>
                                                    <div style={{ fontWeight: '600', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{course.totalLessons} lessons</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{course.instructor?.name}</td>
                                        <td><span className="badge badge-info">{course.category}</span></td>
                                        <td>{statusBadge(course.status)}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{course.enrolledCount || 0}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <Link to={`/courses/${course._id}`} className="btn btn-ghost btn-sm" style={{ padding: '6px 8px' }}>
                                                    <Eye size={14} />
                                                </Link>
                                                {course.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => approveCourse(course._id)} className="btn btn-success btn-sm" style={{ padding: '6px 10px' }}>
                                                            <Check size={14} /> Approve
                                                        </button>
                                                        <button onClick={() => setRejectModal(course._id)} className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}>
                                                            <X size={14} /> Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            {rejectModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Reject Course</h3>
                            <button onClick={() => setRejectModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Reason for rejection *</label>
                                <textarea className="form-input" rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Provide feedback to the instructor..." style={{ resize: 'vertical' }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setRejectModal(null)} className="btn btn-ghost">Cancel</button>
                            <button onClick={rejectCourse} className="btn btn-danger" disabled={!rejectReason.trim()}>Reject Course</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
