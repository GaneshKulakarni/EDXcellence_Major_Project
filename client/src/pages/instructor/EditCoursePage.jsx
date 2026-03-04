import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Save, Trash2 } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function EditCoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/courses/${id}`).then(({ data }) => {
            const c = data.course;
            setForm({
                title: c.title || '', description: c.description || '', shortDescription: c.shortDescription || '',
                category: c.category || 'Web Development', level: c.level || 'All Levels',
                price: c.price || 0, language: c.language || 'English', thumbnail: c.thumbnail || '',
                tags: c.tags || [], requirements: c.requirements || [],
                whatYouLearn: c.whatYouLearn || [], sections: c.sections || []
            });
        }).catch(() => toast.error('Failed to load course'))
            .finally(() => setLoading(false));
    }, [id]);

    const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async (e, publish = false) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/courses/${id}`, { ...form, ...(publish ? { status: 'pending', isPublished: true } : {}) });
            toast.success(publish ? 'Submitted for review!' : 'Course updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this course? This action cannot be undone.')) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success('Course deleted');
            navigate('/instructor/courses');
        } catch (err) {
            toast.error('Failed to delete course');
        }
    };

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;
    if (!form) return <div className="empty-state"><div className="empty-title">Course not found</div></div>;

    return (
        <div className="page-content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Edit Course</h1>
                    <p className="page-subtitle">Update your course content and settings</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleDelete} className="btn btn-danger btn-sm">
                        <Trash2 size={14} /> Delete Course
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card">
                        <div className="card-header"><h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Basic Information</h3></div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-input" value={form.title} onChange={e => setField('title', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Short Description</label>
                                <textarea className="form-input" rows={2} value={form.shortDescription} onChange={e => setField('shortDescription', e.target.value)} style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Description</label>
                                <textarea className="form-input" rows={5} value={form.description} onChange={e => setField('description', e.target.value)} style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select className="form-input form-select" value={form.category} onChange={e => setField('category', e.target.value)}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Level</label>
                                    <select className="form-input form-select" value={form.level} onChange={e => setField('level', e.target.value)}>
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input className="form-input" type="number" min={0} value={form.price} onChange={e => setField('price', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Thumbnail URL</label>
                                <input className="form-input" value={form.thumbnail} onChange={e => setField('thumbnail', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={e => handleSave(e, false)} className="btn btn-outline" disabled={saving}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button type="button" onClick={e => handleSave(e, true)} className="btn btn-primary" disabled={saving}>
                            Submit for Review
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
