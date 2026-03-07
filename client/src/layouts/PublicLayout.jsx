import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { BookOpen, Search, Bell, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, GraduationCap } from 'lucide-react';

export default function PublicLayout() {
    const { user, logout, token } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setProfileOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'instructor') return '/instructor/dashboard';
        return '/student/dashboard';
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="container navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="navbar-logo-icon">
                            <GraduationCap size={20} color="white" />
                        </div>
                        <span className="navbar-logo-text">LearnHub</span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Nav Content */}
                    <div className={`navbar-content ${menuOpen ? 'active' : ''}`}>
                        {/* Nav Links */}
                        <div className="navbar-links">
                            <Link to="/courses" 
                                className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >Browse Courses</Link>
                        </div>

                        {/* Search */}
                        <div className="navbar-search">
                            <Search className="search-icon" size={16} />
                            <input
                                className="search-input"
                                placeholder="Search courses..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        navigate(`/courses?search=${encodeURIComponent(e.target.value.trim())}`);
                                        setMenuOpen(false);
                                    }
                                }}
                            />
                        </div>

                        {/* Auth */}
                        <div className="navbar-auth">
                            {token && user ? (
                                <>
                                    <Link to={getDashboardLink()} className="btn btn-ghost btn-sm nav-dashboard-btn" onClick={() => setMenuOpen(false)}>
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                    <div className="profile-dropdown-container">
                                        <button
                                            className="profile-trigger"
                                            onClick={() => setProfileOpen(!profileOpen)}
                                        >
                                            <div className="avatar avatar-sm" style={{ width: '30px', height: '30px', fontSize: '0.75rem', background: user.avatar ? 'none' : 'var(--gradient-primary)' }}>
                                                {user.avatar
                                                    ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                    : user.name?.charAt(0).toUpperCase()
                                                }
                                            </div>
                                            <span className="profile-name">{user.name?.split(' ')[0]}</span>
                                            <ChevronDown size={14} className="profile-chevron" />
                                        </button>
                                        {profileOpen && (
                                            <div className="profile-dropdown">
                                                <div className="profile-dropdown-header">
                                                    <div className="profile-dropdown-name">{user.name}</div>
                                                    <div className="profile-dropdown-email">{user.email}</div>
                                                </div>
                                                <Link to={getDashboardLink()} onClick={() => { setProfileOpen(false); setMenuOpen(false); }} className="profile-dropdown-item">
                                                    <LayoutDashboard size={16} /> Dashboard
                                                </Link>
                                                <button onClick={handleLogout} className="profile-dropdown-item logout-btn">
                                                    <LogOut size={16} /> Log Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="auth-buttons">
                                    <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Log In</Link>
                                    <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Click outside to close */}
            {(profileOpen || menuOpen) && (
                <div className="overlay" onClick={() => { setProfileOpen(false); setMenuOpen(false); }} />
            )}

            {/* Main content */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{
                background: '#0f172a',
                color: 'rgba(255,255,255,0.7)',
                padding: '48px 0 24px'
            }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '32px', height: '32px', background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <GraduationCap size={18} color="white" />
                                </div>
                                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', fontFamily: 'Plus Jakarta Sans' }}>LearnHub</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.55)' }}>
                                Empowering learners worldwide with expert-led courses and cutting-edge skills.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '12px', fontSize: '0.9rem' }}>Explore</h4>
                            {['Browse Courses', 'Become Instructor', 'Categories'].map(l => (
                                <div key={l} style={{ marginBottom: '8px' }}>
                                    <Link to="/courses" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}>{l}</Link>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '12px', fontSize: '0.9rem' }}>Company</h4>
                            {['About Us', 'Careers', 'Blog', 'Contact'].map(l => (
                                <div key={l} style={{ marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{l}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '12px', fontSize: '0.9rem' }}>Support</h4>
                            {['Help Center', 'Terms of Service', 'Privacy Policy'].map(l => (
                                <div key={l} style={{ marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                        © 2024 LearnHub. All rights reserved. Built with ❤️ for learners worldwide.
                    </div>
                </div>
            </footer>
        </div>
    );
}
