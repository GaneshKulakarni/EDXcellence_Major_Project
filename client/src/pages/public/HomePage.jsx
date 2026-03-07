import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import CourseCard from '../../components/CourseCard';
import {
    GraduationCap, Play, Star, Users, BookOpen, Clock, Award, TrendingUp,
    ChevronRight, Zap, Globe, CheckCircle, ArrowRight, ArrowLeft, Sparkles,
    MousePointer2, MessageSquare, ShieldCheck, Mail, Send, Flame, Trophy
} from 'lucide-react';

const CATEGORIES = [
    { name: 'Web Development', image: '/images/web-dev.png', count: '1.2k' },
    { name: 'Data Science', image: '/images/data-science.png', count: '890' },
    { name: 'Mobile Development', image: '/images/mobile-dev.png', count: '650' },
    { name: 'Machine Learning', image: '/images/machine-learning.png', count: '540' },
    { name: 'DevOps', image: '/images/devops.png', count: '320' },
    { name: 'Design', image: '/images/design.png', count: '780' },
    { name: 'Business', image: '/images/business.png', count: '410' },
    { name: 'Photography', image: '/images/photography.png', count: '220' },
];

const LEARNING_PATHS = [
    { title: 'Full Stack Developer', icon: '💻', courses: '12', duration: '6 Months', color: '#4f46e2' },
    { title: 'Data Scientist', icon: '📊', courses: '8', duration: '4 Months', color: '#0ea5e9' },
    { title: 'UI/UX Designer', icon: '🎨', courses: '10', duration: '3 Months', color: '#ec4899' },
    { title: 'DevOps Engineer', icon: '⚙️', courses: '9', duration: '5 Months', color: '#10b981' },
];

const TOP_INSTRUCTORS = [
    { name: 'Dr. Sarah Wilson', field: 'Machine Learning Expert', avatar: '/images/instructor-2.png', courses: 24, students: '120k', rating: 4.9 },
    { name: 'Alex Rivera', field: 'Senior Web Developer', avatar: '/images/instructor-1.png', courses: 18, students: '85k', rating: 4.8 },
    { name: 'Michael Chen', field: 'Data Science Specialist', avatar: '/images/instructor-1.png', courses: 12, students: '42k', rating: 4.7 },
    { name: 'Emma Thompson', field: 'UX Design Lead', avatar: '/images/instructor-2.png', courses: 15, students: '64k', rating: 4.9 },
];

const TESTIMONIALS = [
    { name: 'James Carter', role: 'Software Engineer at Google', quote: "LearnHub changed my career path. The Full Stack curriculum is more practical than my college degree.", avatar: '/images/student-1.png' },
    { name: 'Sophia Lee', role: 'UI Designer at Figma', quote: "The community support here is incredible. I found my first design internship through the LearnHub network.", avatar: '/images/student-2.png' },
    { name: 'Ryan Miller', role: 'Data Analyst at Amazon', quote: "Comprehensive courses and legendary instructors. The hands-on projects are exactly what I needed.", avatar: '/images/student-1.png' },
];

const LEADERBOARD = [
    { name: 'Alice Wong', streak: 42, points: '12,450', avatar: '/images/student-2.png' },
    { name: 'Bob Smith', streak: 38, points: '11,200', avatar: '/images/student-1.png' },
    { name: 'Charlie Davis', streak: 35, points: '10,800', avatar: '/images/instructor-1.png' },
];

export default function HomePage() {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses/featured');
                if (data.courses && data.courses.length > 0) {
                    setFeaturedCourses(data.courses);
                } else {
                    throw new Error('No courses found');
                }
            } catch {
                // Fallback to demo data if API fails or returns empty
                setFeaturedCourses([
                    { _id: '1', title: 'Complete React & Next.js Masterclass', instructor: { name: 'Alex Rivera' }, thumbnail: '/images/course-webdev.png', rating: 4.9, ratingCount: 1240, enrolledCount: 45000, level: 'Beginner', price: 499, category: 'Web Development', totalLessons: 84, totalDuration: 72000 },
                    { _id: '2', title: 'Python for Data Science: From Zero to Hero', instructor: { name: 'Michael Chen' }, thumbnail: '/images/course-python.png', rating: 4.8, ratingCount: 850, enrolledCount: 32000, level: 'Intermediate', price: 0, category: 'Data Science', totalLessons: 62, totalDuration: 54000 },
                    { _id: '3', title: 'Advanced UX Research & UI Prototyping', instructor: { name: 'Emma Thompson' }, thumbnail: '/images/course-ux.png', rating: 4.9, ratingCount: 620, enrolledCount: 18000, level: 'Advanced', price: 799, category: 'Design', totalLessons: 45, totalDuration: 36000 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <div className="home-page">
            {/* Page Navigation Arrows (Floating) */}
            <div className="page-nav-arrows">
                <button onClick={() => window.history.back()} className="nav-arrow-btn" title="Go Back">
                    <ArrowLeft size={20} />
                </button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-arrow-btn" title="Back to Top">
                    <TrendingUp size={20} style={{ transform: 'rotate(-45deg)' }} />
                </button>
                <button onClick={() => window.history.forward()} className="nav-arrow-btn" title="Go Forward">
                    <ArrowRight size={20} />
                </button>
            </div>

            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) 0.8fr', gap: '60px', alignItems: 'center' }}>
                        <div className="hero-content animate-slide-up">
                            <div className="hero-badge">
                                <Sparkles size={14} />
                                <span>🎉 10,000+ Students enrolled this month</span>
                            </div>

                            <h1 className="hero-title">
                                Master New Skills with<br />
                                <span>Industry Experts</span>
                            </h1>

                            <p className="hero-desc">
                                Join our global community of lifelong learners. Get access to 1,200+ courses
                                covering everything from Web Development to Creative Arts.
                            </p>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="hero-search-form">
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="What do you want to learn?"
                                    className="hero-search-input"
                                />
                                <button type="submit" className="hero-btn-primary search-submit-btn">
                                    Search
                                </button>
                            </form>

                            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
                                Popular: <span style={{ color: 'rgba(255,255,255,0.9)' }}>Next.js, Tailwind, AWS, Python, Figma</span>
                            </div>

                            {/* Stats */}
                            <div className="hero-stats">
                                {[
                                    { value: '50K+', label: 'Learners' },
                                    { value: '1,200+', label: 'Courses' },
                                    { value: '4.9★', label: 'Rating' },
                                    { value: '24/7', label: 'Support' },
                                ].map(stat => (
                                    <div key={stat.label}>
                                        <div className="hero-stat-value">{stat.value}</div>
                                        <div className="hero-stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero UI Preview */}
                        <div className="hero-mockup animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="preview-window" style={{ width: '100%', maxWidth: '480px' }}>
                                <div className="preview-nav">
                                    <div className="nav-dot" style={{ background: '#ff5f56' }} />
                                    <div className="nav-dot" style={{ background: '#ffbd2e' }} />
                                    <div className="nav-dot" style={{ background: '#27c93f' }} />
                                </div>
                                <img src="/images/learning-preview.png" alt="LearnHub UI" style={{ width: '100%', display: 'block' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Browse by Category</h2>
                            <p className="section-subtitle">Explore our extensive library across all domains</p>
                        </div>
                        <Link to="/courses" className="btn btn-outline btn-sm">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="category-grid">
                        {CATEGORIES.map((cat) => (
                            <Link key={cat.name} to={`/courses?category=${encodeURIComponent(cat.name)}`} className="category-card">
                                <div className="category-card-image-wrap">
                                    <img src={cat.image} alt={cat.name} className="category-card-image" />
                                    <div className="category-card-overlay" />
                                </div>
                                <div className="category-card-content">
                                    <div className="category-card-name">{cat.name}</div>
                                    <div className="category-card-count">{cat.count} courses</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED COURSES ===== */}
            <section style={{ padding: '100px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">🔥 Featured Courses</h2>
                            <p className="section-subtitle">Hand-picked selections for your learning journey</p>
                        </div>
                        <div className="header-controls">
                            <Link to="/courses" className="btn btn-outline btn-sm">Browse All</Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="courses-grid">
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '16px' }} />)}
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {featuredCourses.map(course => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ===== LEARNING PATHS ===== */}
            <section style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Structured Learning Paths</h2>
                            <p className="section-subtitle">Follow a curated roadmap to master a profession</p>
                        </div>
                    </div>

                    <div className="learning-paths-scroll">
                        {LEARNING_PATHS.map((path, i) => (
                            <Link key={i} to="/courses" className="path-card">
                                <div className="path-icon">{path.icon}</div>
                                <h3 className="path-title">{path.title}</h3>
                                <div className="path-meta">
                                    <BookOpen size={14} /> {path.courses} Courses
                                    <Clock size={14} /> {path.duration}
                                </div>
                                <div className="path-arrow"><ArrowRight size={20} /></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== INSTRUCTORS ===== */}
            <section style={{ padding: '100px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 className="section-title">Learn from the Best</h2>
                            <p className="section-subtitle">Taught by world-class creators and professionals</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                        {TOP_INSTRUCTORS.map((inst, i) => (
                            <div key={i} className="instructor-card">
                                <img src={inst.avatar} alt={inst.name} className="instructor-avatar" />
                                <h3 className="instructor-name">{inst.name}</h3>
                                <div className="instructor-field">{inst.field}</div>
                                <div className="instructor-stats">
                                    <div>
                                        <div className="inst-stat-val">{inst.courses}</div>
                                        <div className="inst-stat-label">Courses</div>
                                    </div>
                                    <div>
                                        <div className="inst-stat-val">{inst.students}</div>
                                        <div className="inst-stat-label">Students</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COURSE PREVIEW / HOW IT WORKS ===== */}
            <section style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '24px', lineHeight: 1.2 }}>
                                A Better Way to<br />
                                <span style={{ color: 'var(--primary)' }}>Master Your Craft</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {[
                                    { icon: <Play size={24} />, title: "High-Quality Video Lessons", desc: "Watch crisp HD videos on any device with adjustable playback speed." },
                                    { icon: <Users size={24} />, title: "Interactive Community", desc: "Share your progress and get help from instructors and fellow students." },
                                    { icon: <Award size={24} />, title: "Professional Certifications", desc: "Earn certificates that you can share on your LinkedIn profile." },
                                ].map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-bg)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                                        }}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px' }}>{step.title}</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="preview-window">
                            <div className="preview-nav">
                                <div className="nav-dot" style={{ background: '#ff5f56' }} />
                                <div className="nav-dot" style={{ background: '#ffbd2e' }} />
                                <div className="nav-dot" style={{ background: '#27c93f' }} />
                            </div>
                            <img src="/images/learning-preview.png" alt="How it works" style={{ width: '100%', display: 'block' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMMUNITY & LEADERBOARD ===== */}
            <section style={{ padding: '100px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div className="community-box">
                        <div>
                            <div style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '16px', alignItems: 'center', gap: '6px' }}>
                                <Flame size={14} /> LIVE COMMUNITY STATS
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '20px' }}>Join 50,000+ Active Learners</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.6 }}>
                                Don't learn in isolation. Join our leaderboard, participate in discussions, and stay motivated with daily streaks.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>15.4M</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lessons Completed</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>124</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Countries Represented</div>
                                </div>
                            </div>
                        </div>
                        <div className="leaderboard">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h4 style={{ fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Trophy size={18} color="#fbbf24" /> Leaderboard
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated 5m ago</span>
                            </div>
                            {LEADERBOARD.map((user, i) => (
                                <div key={i} className="leaderboard-item">
                                    <div className="leaderboard-rank">#{i + 1}</div>
                                    <img src={user.avatar} alt={user.name} className="leaderboard-avatar" />
                                    <div className="leaderboard-name">{user.name}</div>
                                    <div className="leaderboard-streak">
                                        <Flame size={12} /> {user.streak}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 className="section-title">Success Stories</h2>
                            <p className="section-subtitle">How LearnHub transformed lives across the globe</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="testimonial-card">
                                <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                </div>
                                <p className="testimonial-quote">"{t.quote}"</p>
                                <div className="testimonial-user">
                                    <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                                    <div>
                                        <div className="testimonial-name">{t.name}</div>
                                        <div className="testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEWSLETTER ===== */}
            <section style={{ padding: '60px 0 100px' }}>
                <div className="container">
                    <div className="newsletter-card">
                        <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', marginBottom: '24px', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                            <Mail size={16} /> Stay Ahead of the Curve
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>Get Course Updates</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                            Subscribe to our newsletter and get the latest courses, articles, and resources delivered to your inbox.
                        </p>
                        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                            <button type="submit" className="newsletter-btn">Subscribe <Send size={16} style={{ marginLeft: '8px' }} /></button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ===== CTA (Footer CTA) ===== */}
            <section className="cta-section" style={{ padding: '0 0 100px' }}>
                <div className="cta-container container">
                    <img src="/images/cta-banner.png" alt="Call to Action" className="cta-background" />
                    <div className="cta-overlay" />
                    <div className="cta-content">
                        <h2 className="cta-title">Start Your Journey Today</h2>
                        <p className="cta-desc">
                            Ready to join the community? Create your account today and get access to free introductory courses.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="hero-btn-primary cta-btn">Sign Up Now</Link>
                            <Link to="/courses" className="hero-btn-outline cta-btn">Explore Library</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
