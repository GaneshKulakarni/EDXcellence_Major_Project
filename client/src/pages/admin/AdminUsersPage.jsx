import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Search, Users, UserCheck, Shield } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);
            const { data } = await api.get(`/admin/users?${params}`);
            setUsers(data.users || []);
            setTotal(data.total || 0);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, [search, roleFilter]);

    const updateRole = async (userId, role) => {
        try {
            const { data } = await api.patch(`/admin/users/${userId}`, { role });
            setUsers(u => u.map(user => user._id === userId ? data.user : user));
            toast.success(`Role updated to ${role}`);
        } catch { toast.error('Failed to update role'); }
    };

    const toggleStatus = async (user) => {
        try {
            const { data } = await api.patch(`/admin/users/${user._id}`, { isActive: !user.isActive });
            setUsers(u => u.map(x => x._id === user._id ? data.user : x));
            toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
        } catch { toast.error('Failed to update status'); }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(u => u.filter(x => x._id !== userId));
            toast.success('User deleted');
        } catch { toast.error('Failed to delete user'); }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">{total} total users</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: 1, maxWidth: '360px' }}>
                    <Search className="input-icon" size={16} />
                    <input className="form-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-input form-select" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="student">Students</option>
                    <option value="instructor">Instructors</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            <div className="card">
                {loading ? (
                    <div style={{ padding: '24px' }}>
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '52px', marginBottom: '8px', borderRadius: '8px' }} />)}
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="avatar avatar-sm" style={{ background: user.avatar ? 'none' : 'var(--gradient-primary)' }}>
                                                    {user.avatar ? <img src={user.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /> : user.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={e => updateRole(user._id, e.target.value)}
                                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem', cursor: 'pointer' }}
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => toggleStatus(user)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button onClick={() => deleteUser(user._id)} className="btn btn-danger btn-sm" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
                                                    Delete
                                                </button>
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
