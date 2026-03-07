import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import CourseCard from '../../components/CourseCard';
import {
    GraduationCap, Play, Star, Users, BookOpen, Award, TrendingUp,
    ChevronRight, Zap, Globe, CheckCircle, ArrowRight, Sparkles
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

const FEATURES = [
    { icon: '🎯', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
    { icon: '📱', title: 'Learn Anywhere', desc: 'Access courses on any device, anytime, at your own pace.' },
    { icon: '🏆', title: 'Get Certified', desc: 'Earn certificates upon completion to boost your career.' },
    { icon: '♾️', title: 'Lifetime Access', desc: 'Buy once, access forever. Including all future updates.' },
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
                setFeaturedCourses(data.courses || []);
            } catch {
                // Use demo data if API fails
                setFeaturedCourses([]);
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
        <div>
            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                        <div className="hero-content animate-slide-up">
                            <div className="hero-badge">
                                <Sparkles size={14} />
                                <span>🎉 10,000+ Students enrolled this month</span>
                            </div>

                            <h1 className="hero-title">
                                Upgrade Your Skills with<br />
                                <span>Expert-Led Courses</span>
                            </h1>

                            <p className="hero-desc">
                                Join millions of learners from around the world and gain the skills you need
                                to succeed in today's fast-changing digital world.
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
                                Popular: <span style={{ color: 'rgba(255,255,255,0.9)' }}>React, Python, Machine Learning, UI/UX Design</span>
                            </div>

                            {/* Stats */}
                            <div className="hero-stats">
                                {[
                                    { value: '50K+', label: 'Active Students' },
                                    { value: '1,200+', label: 'Expert Courses' },
                                    { value: '4.8★', label: 'Average Rating' },
                                    { value: '95%', label: 'Completion Rate' },
                                ].map(stat => (
                                    <div key={stat.label}>
                                        <div className="hero-stat-value">{stat.value}</div>
                                        <div className="hero-stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '420px', height: '360px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📚</div>
                                    <div style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px' }}>
                                        Start Learning Today
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '24px' }}>
                                        Join 50,000+ students growing their skills
                                    </div>
                                    <Link to="/register" className="hero-btn-primary" style={{ display: 'inline-block', padding: '12px 24px' }}>
                                        Get Started Free →
                                    </Link>
                                </div>

                                {/* Floating cards */}
                                <div style={{
                                    position: 'absolute', top: '20px', right: '-20px',
                                    background: 'white', borderRadius: '12px', padding: '12px 16px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px'
                                }}>
                                    <div style={{ width: '36px', height: '36px', background: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏆</div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>Certified!</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Course completed</div>
                                    </div>
                                </div>

                                <div style={{
                                    position: 'absolute', bottom: '30px', left: '-20px',
                                    background: 'white', borderRadius: '12px', padding: '12px 16px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px'
                                }}>
                                    <div style={{ fontSize: '1.2rem' }}>⭐</div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>4.9/5 Rating</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>From 12k reviews</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section style={{ padding: '80px 0', background: 'white' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Browse by Category</h2>
                            <p className="section-subtitle">Explore our extensive library across all domains</p>
                        </div>
                        <Link to="/courses" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="category-grid">
                        {CATEGORIES.map((cat, i) => (
                            <Link
                                key={cat.name}
                                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                                className="category-card"
                            >
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
            <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">🔥 Trending Courses</h2>
                            <p className="section-subtitle">Most popular courses this week</p>
                        </div>
                        <Link to="/courses" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                            Browse All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="courses-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <div className="skeleton" style={{ height: '180px' }} />
                                    <div style={{ padding: '16px' }}>
                                        <div className="skeleton" style={{ height: '16px', marginBottom: '8px' }} />
                                        <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '16px' }} />
                                        <div className="skeleton" style={{ height: '12px', width: '40%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : featuredCourses.length > 0 ? (
                        <div className="courses-grid">
                            {featuredCourses.map(course => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon"><BookOpen size={32} /></div>
                            <div className="empty-title">No courses yet</div>
                            <p className="empty-desc">Be the first to publish a course!</p>
                            <Link to="/register?role=instructor" className="btn btn-primary">Become an Instructor</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section style={{ padding: '80px 0', background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>Why Choose LearnHub?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                            We provide the best learning experience with industry-proven methods.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{
                                padding: '32px 28px',
                                background: 'var(--bg)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--border)',
                                transition: 'var(--transition)',
                                cursor: 'default'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-bg)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{f.icon}</div>
                                <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '10px' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.7' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="cta-section">
                <div className="cta-container container">
                    <img src="/images/cta-banner.png" alt="Call to Action" className="cta-background" />
                    <div className="cta-overlay" />
                    <div className="cta-content">
                        <h2 className="cta-title">
                            Ready to Start Learning?
                        </h2>
                        <p className="cta-desc">
                            Join 50K+ learners who are already building their future with our expert-led courses.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="hero-btn-primary cta-btn">
                                Get Started Free →
                            </Link>
                            <Link to="/courses" className="hero-btn-outline cta-btn">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
