import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import CourseCard from '../../components/CourseCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Other'];
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
    { label: 'Newest', value: '-createdAt' },
    { label: 'Most Popular', value: '-enrolledCount' },
    { label: 'Highest Rated', value: '-rating' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
];

export default function CoursesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const sort = searchParams.get('sort') || '-createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const [searchInput, setSearchInput] = useState(search);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 12, sort });
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (level) params.append('level', level);
            const { data } = await api.get(`/courses?${params}`);
            setCourses(data.courses || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, category, level, sort, page]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value); else next.delete(key);
        next.delete('page');
        setSearchParams(next);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateParam('search', searchInput);
    };

    const clearFilters = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const activeFiltersCount = [search, category, level].filter(Boolean).length;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{ background: 'var(--gradient-hero)', padding: '48px 0 32px' }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                        {category ? `${category} Courses` : search ? `Results for "${search}"` : 'All Courses'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '24px' }}>
                        {total} {total === 1 ? 'course' : 'courses'} found
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} style={{
                        display: 'flex', gap: '12px', maxWidth: '580px'
                    }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <Search className="input-icon" size={16} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: '44px', background: 'rgba(255,255,255,0.95)' }}
                                placeholder="Search courses..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary-dark)', boxShadow: 'none' }}>
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="container" style={{ padding: '32px 24px' }}>
                {/* Filters row */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
                    {/* Category chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                        <button
                            className={`chip ${!category ? 'active' : ''}`}
                            onClick={() => updateParam('category', '')}
                        >All</button>
                        {CATEGORIES.map(c => (
                            <button
                                key={c}
                                className={`chip ${category === c ? 'active' : ''}`}
                                onClick={() => updateParam('category', c)}
                            >{c}</button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        className="form-input form-select"
                        style={{ width: 'auto', paddingRight: '40px' }}
                        value={sort}
                        onChange={e => updateParam('sort', e.target.value)}
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', gap: '4px' }}>
                            <X size={14} /> Clear ({activeFiltersCount})
                        </button>
                    )}
                </div>

                {/* Level filter */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                    {LEVELS.map(l => (
                        <button
                            key={l}
                            className={`chip ${level === (l === 'All Levels' ? '' : l) ? 'active' : ''}`}
                            onClick={() => updateParam('level', l === 'All Levels' ? '' : l)}
                        >{l}</button>
                    ))}
                </div>

                {/* Courses Grid */}
                {loading ? (
                    <div className="courses-grid">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                <div className="skeleton" style={{ height: '180px' }} />
                                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className="skeleton" style={{ height: '14px' }} />
                                    <div className="skeleton" style={{ height: '14px', width: '70%' }} />
                                    <div className="skeleton" style={{ height: '12px', width: '50%', marginTop: '8px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length > 0 ? (
                    <>
                        <div className="courses-grid">
                            {courses.map(course => <CourseCard key={course._id} course={course} />)}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => updateParam('page', String(i + 1))}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '10px',
                                            border: '1.5px solid',
                                            borderColor: page === i + 1 ? 'var(--primary)' : 'var(--border)',
                                            background: page === i + 1 ? 'var(--primary)' : 'white',
                                            color: page === i + 1 ? 'white' : 'var(--text-secondary)',
                                            fontWeight: '600', cursor: 'pointer',
                                            transition: 'var(--transition)', fontSize: '0.875rem'
                                        }}
                                    >{i + 1}</button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon" style={{ fontSize: '3rem' }}>🔍</div>
                        <div className="empty-title">No courses found</div>
                        <p className="empty-desc">Try adjusting your filters or search terms</p>
                        <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
