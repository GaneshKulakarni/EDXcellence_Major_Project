import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Save, Eye, EyeOff, Camera } from 'lucide-react';

export default function StudentProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [form, setForm] = useState({
        name: user?.name || '', bio: user?.bio || '',
        headline: user?.headline || '', avatar: user?.avatar || ''
    });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('profile');

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put('/auth/me', form);
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally { setSaving(false); }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) { toast.error('Passwords do not match'); return; }
        setSaving(true);
        try {
            await api.put('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.new });
            toast.success('Password changed!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally { setSaving(false); }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your account information</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px' }}>
                {/* Profile card */}
                <div>
                    <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                            <div className="avatar avatar-xl" style={{ margin: '0 auto', background: user?.avatar ? 'none' : 'var(--gradient-primary)' }}>
                                {user?.avatar
                                    ? <img src={user.avatar} alt="" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' }} />
                                    : user?.name?.charAt(0).toUpperCase()
                                }
                            </div>
                            <button style={{
                                position: 'absolute', bottom: '0', right: '0',
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: 'var(--primary)', border: '2px solid white',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Camera size={12} color="white" />
                            </button>
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{user?.email}</div>
                        <span className="badge badge-primary">{user?.role}</span>
                        {user?.headline && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5' }}>{user.headline}</p>
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div>
                    <div className="tabs" style={{ marginBottom: '24px' }}>
                        <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Profile Info</button>
                        <button className={`tab ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}>Security</button>
                    </div>

                    {tab === 'profile' && (
                        <form onSubmit={saveProfile} className="card">
                            <div className="card-header">
                                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Personal Information</h3>
                            </div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Headline</label>
                                        <input className="form-input" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="e.g. Full Stack Developer" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-input" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." style={{ resize: 'vertical' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Avatar URL</label>
                                    <input className="form-input" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {tab === 'security' && (
                        <form onSubmit={changePassword} className="card">
                            <div className="card-header">
                                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Change Password</h3>
                            </div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {['current', 'new', 'confirm'].map((field, i) => (
                                    <div key={field} className="form-group">
                                        <label className="form-label">{i === 0 ? 'Current Password' : i === 1 ? 'New Password' : 'Confirm New Password'}</label>
                                        <div className="input-group">
                                            <Lock className="input-icon" size={16} />
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                className="form-input"
                                                value={passwords[field]}
                                                onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
                                                placeholder={i === 0 ? 'Current password' : i === 1 ? 'Min. 6 characters' : 'Repeat new password'}
                                                style={{ paddingRight: i === 0 ? '44px' : '12px' }}
                                            />
                                            {i === 0 && (
                                                <button type="button" onClick={() => setShowPass(!showPass)}
                                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    <Lock size={16} /> {saving ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
