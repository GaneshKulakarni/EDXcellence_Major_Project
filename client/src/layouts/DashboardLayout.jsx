import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import {
    LayoutDashboard, BookOpen, Users, GraduationCap, Settings,
    LogOut, Bell, Menu, X, ChevronRight, Trophy, BarChart3,
    PlusCircle, ClipboardList, CheckSquare, Star, Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

const studentNav = [
    { label: 'Overview', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/student/courses', icon: BookOpen },
    { label: 'Profile', href: '/student/profile', icon: Settings },
];

const instructorNav = [
    { label: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
    { label: 'Create Course', href: '/instructor/courses/create', icon: PlusCircle },
    { label: 'Quizzes', href: '/instructor/quizzes', icon: ClipboardList },
];

const adminNav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
];

export default function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = user?.role === 'admin' ? adminNav
        : user?.role === 'instructor' ? instructorNav
            : studentNav;

    const roleLabel = user?.role === 'admin' ? 'Admin'
        : user?.role === 'instructor' ? 'Instructor'
            : 'Student';

    const roleColor = user?.role === 'admin' ? '#ef4444'
        : user?.role === 'instructor' ? '#f59e0b'
            : '#10b981';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <GraduationCap size={20} color="white" />
                </div>
                <span className="sidebar-logo-text">LearnHub</span>
            </div>

            {/* User info */}
            <div style={{ padding: '16px 16px 8px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px',
                    background: 'var(--primary-bg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(99,102,241,0.15)'
                }}>
                    <div className="avatar avatar-md" style={{
                        background: user?.avatar ? 'none' : 'var(--gradient-primary)',
                        flexShrink: 0
                    }}>
                        {user?.avatar
                            ? <img src={user.avatar} alt="avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                            : user?.name?.charAt(0).toUpperCase()
                        }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name}
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.7rem', fontWeight: '600',
                            background: roleColor + '20', color: roleColor,
                            padding: '2px 8px', borderRadius: '20px', marginTop: '2px'
                        }}>
                            {roleLabel}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Main Menu</div>
                    {navItems.map(item => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">Quick Links</div>
                    <NavLink to="/" className="sidebar-item">
                        <Home size={18} /> Browse Courses
                    </NavLink>
                </div>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-item" style={{ color: 'var(--error)', width: '100%' }}>
                    <LogOut size={18} /> Log Out
                </button>
            </div>
        </>
    );

    return (
        <div className="dashboard-layout">
            {/* Desktop Sidebar */}
            <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
                <SidebarContent />
            </aside>

            {/* Mobile overlay sidebar */}
            {sidebarOpen && (
                <>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} onClick={() => setSidebarOpen(false)} />
                    <aside className="sidebar open" style={{ display: 'flex', flexDirection: 'column', zIndex: 201 }}>
                        <SidebarContent />
                    </aside>
                </>
            )}

            {/* Main content */}
            <div className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ display: 'none', '@media (max-width: 768px)': { display: 'flex' } }}
                    >
                        <Menu size={20} />
                    </button>

                    <div style={{ flex: 1 }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Bell */}
                        <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
                            <Bell size={18} />
                            <span className="notif-dot" />
                        </button>

                        {/* Avatar */}
                        <div className="avatar avatar-sm" style={{
                            background: user?.avatar ? 'none' : 'var(--gradient-primary)',
                            cursor: 'pointer'
                        }}>
                            {user?.avatar
                                ? <img src={user.avatar} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                : user?.name?.charAt(0).toUpperCase()
                            }
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name?.split(' ')[0]}</span>
                    </div>
                </header>

                {/* Page outlet */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
