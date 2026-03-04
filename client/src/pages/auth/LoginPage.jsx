import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill all fields'); return; }
        try {
            const data = await login(email, password);
            toast.success(`Welcome back, ${data.user.name}! 👋`);
            // Redirect based on role
            if (data.user.role === 'admin') navigate('/admin/dashboard');
            else if (data.user.role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const loginAsDemo = async (role) => {
        const credentials = {
            admin: { email: 'admin@learnhub.com', password: 'admin123' },
            instructor: { email: 'instructor@learnhub.com', password: 'instructor123' },
            student: { email: 'student@learnhub.com', password: 'student123' },
        };
        const cred = credentials[role];
        setEmail(cred.email);
        setPassword(cred.password);
        try {
            const data = await login(cred.email, cred.password);
            toast.success(`Logged in as ${role}!`);
            if (data.user.role === 'admin') navigate('/admin/dashboard');
            else if (data.user.role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            toast.error('Demo account not set up yet. Please register first.');
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
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}
                    dangerouslySetInnerHTML={{ __html: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/></svg>` }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>LearnHub</span>
                    </Link>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
                        Welcome back,<br />Learner! 👋
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: '400px', lineHeight: '1.7', marginBottom: '40px' }}>
                        Continue your learning journey. Pick up exactly where you left off.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '32px' }}>
                        {[{ val: '50K+', label: 'Learners' }, { val: '1.2K+', label: 'Courses' }, { val: '4.8★', label: 'Rating' }].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{s.val}</div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div style={{ width: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
                <div style={{ marginBottom: '36px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Sign In</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up free</Link>
                    </p>
                </div>

                {/* Demo logins */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Quick Demo Login
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['admin', 'instructor', 'student'].map(role => (
                            <button key={role} onClick={() => loginAsDemo(role)} style={{
                                flex: 1, padding: '8px', borderRadius: 'var(--radius-md)',
                                border: '1.5px solid var(--border)', background: 'white',
                                cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600',
                                color: 'var(--text-secondary)', transition: 'var(--transition)',
                                textTransform: 'capitalize'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-bg)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'white'; }}
                            >{role}</button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                            <Mail className="input-icon" size={16} />
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <Lock className="input-icon" size={16} />
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '44px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ marginTop: '8px', justifyContent: 'center' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                Signing in...
                            </span>
                        ) : (
                            <><ArrowRight size={18} /> Sign In</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
