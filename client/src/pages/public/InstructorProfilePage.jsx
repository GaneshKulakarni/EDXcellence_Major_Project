import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import CourseCard from '../../components/CourseCard';
import { User, BookOpen, Star, Clock } from 'lucide-react';

export default function InstructorProfilePage() {
    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/users/${id}`),
            api.get(`/courses?instructor=${id}&limit=12`)
        ]).then(([userRes, coursesRes]) => {
            setInstructor(userRes.data.user);
            setCourses(coursesRes.data.courses || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;
    if (!instructor) return <div className="empty-state"><div className="empty-title">Instructor not found</div></div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{ background: 'var(--gradient-hero)', padding: '60px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        <div className="avatar" style={{
                            width: '100px', height: '100px', fontSize: '2.5rem',
                            background: instructor.avatar ? 'none' : 'rgba(255,255,255,0.2)',
                            border: '3px solid rgba(255,255,255,0.4)'
                        }}>
                            {instructor.avatar ? <img src={instructor.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : instructor.name?.charAt(0)}
                        </div>
                        <div style={{ color: 'white' }}>
                            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>{instructor.name}</h1>
                            {instructor.headline && <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>{instructor.headline}</div>}
                            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                <span><BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />{courses.length} courses</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '48px 24px' }}>
                {instructor.bio && (
                    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '32px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>About {instructor.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{instructor.bio}</p>
                    </div>
                )}

                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Courses by {instructor.name}</h2>
                {courses.length > 0 ? (
                    <div className="courses-grid">
                        {courses.map(course => <CourseCard key={course._id} course={course} />)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon"><BookOpen size={28} /></div>
                        <div className="empty-title">No courses yet</div>
                    </div>
                )}
            </div>
        </div>
    );
}
