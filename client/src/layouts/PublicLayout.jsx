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
            <nav style={{
                background: 'white',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
                <div className="container" style={{ height: '68px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <div style={{
                            width: '36px', height: '36px',
                            background: 'var(--gradient-primary)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <GraduationCap size={20} color="white" />
                        </div>
                        <span style={{
                            fontSize: '1.25rem', fontWeight: '800',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>LearnHub</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex gap-2" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
                        <Link to="/courses" style={{
                            padding: '8px 16px', borderRadius: 'var(--radius-md)',
                            fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-secondary)',
                            transition: 'var(--transition)'
                        }}
                            className={location.pathname === '/courses' ? 'text-primary' : ''}
                        >Browse Courses</Link>
                    </div>

                    {/* Search */}
                    <div className="search-input-wrap" style={{ flex: 1, maxWidth: '360px', marginLeft: 'auto' }}>
                        <Search className="search-icon" size={16} />
                        <input
                            className="search-input"
                            placeholder="Search courses..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    navigate(`/courses?search=${encodeURIComponent(e.target.value.trim())}`);
                                }
                            }}
                        />
                    </div>

                    {/* Auth */}
                    <div className="flex items-center gap-3">
                        {token && user ? (
                            <>
                                <Link to={getDashboardLink()} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
                                    <LayoutDashboard size={16} /> Dashboard
                                </Link>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '6px 12px', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)', background: 'white', cursor: 'pointer',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <div className="avatar avatar-sm" style={{ width: '30px', height: '30px', fontSize: '0.75rem', background: user.avatar ? 'none' : 'var(--gradient-primary)' }}>
                                            {user.avatar
                                                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                : user.name?.charAt(0).toUpperCase()
                                            }
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                                        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                                    </button>
                                    {profileOpen && (
                                        <div style={{
                                            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                            background: 'white', border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
                                            minWidth: '200px', overflow: 'hidden', zIndex: 200,
                                            animation: 'slideUp 0.2s ease'
                                        }}>
                                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                            </div>
                                            <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'var(--transition)' }}>
                                                <LayoutDashboard size={16} /> Dashboard
                                            </Link>
                                            <button onClick={handleLogout}
                                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--error)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', transition: 'var(--transition)' }}>
                                                <LogOut size={16} /> Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Click outside to close */}
            {profileOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setProfileOpen(false)} />
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
