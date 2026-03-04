import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
    const { register, loading } = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        try {
            const data = await register(form.name, form.email, form.password, form.role);
            toast.success(`Welcome to LearnHub, ${data.user.name}! 🎉`);
            if (data.user.role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)'
        }}>
            {/* Left panel */}
            <div style={{
                flex: '1', background: 'var(--gradient-hero)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px',
                color: 'white', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>LearnHub</span>
                    </Link>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
                        Start your learning<br />journey today 🚀
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: '400px', lineHeight: '1.7', marginBottom: '40px' }}>
                        Join 50,000+ learners building new skills and advancing their careers.
                    </p>

                    {/* Benefits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            'Access 1,200+ expert-led courses',
                            'Learn at your own pace, anytime',
                            'Earn industry-recognized certificates',
                            'Join a community of 50K+ learners'
                        ].map(b => (
                            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Check size={12} color="white" />
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div style={{ width: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
                    </p>
                </div>

                {/* Role selector */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>I want to</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                            { val: 'student', label: '📖 Learn', desc: 'Access courses' },
                            { val: 'instructor', label: '🎓 Teach', desc: 'Create & sell courses' },
                        ].map(r => (
                            <button key={r.val} type="button" onClick={() => setForm(p => ({ ...p, role: r.val }))} style={{
                                padding: '14px 16px', borderRadius: 'var(--radius-lg)',
                                border: `2px solid ${form.role === r.val ? 'var(--primary)' : 'var(--border)'}`,
                                background: form.role === r.val ? 'var(--primary-bg)' : 'white',
                                cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)'
                            }}>
                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: form.role === r.val ? 'var(--primary)' : 'var(--text-primary)', marginBottom: '2px' }}>{r.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-group">
                            <User className="input-icon" size={16} />
                            <input name="name" type="text" className="form-input" placeholder="John Doe"
                                value={form.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                            <Mail className="input-icon" size={16} />
                            <input name="email" type="email" className="form-input" placeholder="you@example.com"
                                value={form.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <Lock className="input-icon" size={16} />
                            <input name="password" type={showPass ? 'text' : 'password'} className="form-input"
                                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required
                                style={{ paddingRight: '44px' }}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                            }}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ justifyContent: 'center', marginTop: '8px' }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                Creating account...
                            </span>
                        ) : (
                            <><ArrowRight size={18} /> Create Account</>
                        )}
                    </button>

                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
