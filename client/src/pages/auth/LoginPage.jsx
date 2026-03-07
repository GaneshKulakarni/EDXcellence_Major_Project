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
        <div className="auth-container">
            {/* Left panel */}
            <div className="auth-sidebar">
                <div className="auth-sidebar-overlay"
                    dangerouslySetInnerHTML={{ __html: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/></svg>` }}
                />
                <div className="auth-sidebar-content">
                    <Link to="/" className="auth-logo">
                        <div className="auth-logo-icon">
                            <GraduationCap size={24} color="white" />
                        </div>
                        <span className="auth-logo-text">LearnHub</span>
                    </Link>

                    <h1 className="auth-welcome-title">
                        Welcome back,<br />Learner! 👋
                    </h1>
                    <p className="auth-welcome-desc">
                        Continue your learning journey. Pick up exactly where you left off.
                    </p>

                    {/* Stats */}
                    <div className="auth-stats">
                        {[{ val: '50K+', label: 'Learners' }, { val: '1.2K+', label: 'Courses' }, { val: '4.8★', label: 'Rating' }].map(s => (
                            <div key={s.label}>
                                <div className="auth-stat-value">{s.val}</div>
                                <div className="auth-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="auth-form-wrapper">
                <div className="auth-form-header">
                    <h2 className="auth-form-title">Sign In</h2>
                    <p className="auth-form-subtitle">
                        Don't have an account? <Link to="/register" className="auth-link">Sign up free</Link>
                    </p>
                </div>

                {/* Demo logins */}
                <div className="demo-login-box">
                    <div className="demo-login-label">
                        Quick Demo Login
                    </div>
                    <div className="demo-login-buttons">
                        {['admin', 'instructor', 'student'].map(role => (
                            <button key={role} onClick={() => loginAsDemo(role)} className="demo-btn"
                                textTransform="capitalize"
                            >{role}</button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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
                                className="password-toggle"
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="spinner-sm" />
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
