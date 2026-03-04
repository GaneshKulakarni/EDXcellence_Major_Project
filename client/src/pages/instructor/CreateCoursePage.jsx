import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, Plus, Save, Eye } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function CreateCoursePage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', shortDescription: '',
        category: 'Web Development', level: 'All Levels',
        price: 0, language: 'English', thumbnail: '',
        tags: [], requirements: [], whatYouLearn: [], targetAudience: [],
        sections: []
    });
    const [newTag, setNewTag] = useState('');
    const [newReq, setNewReq] = useState('');
    const [newWyll, setNewWyll] = useState('');

    const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const addToArray = (field, value, setter) => {
        if (!value.trim()) return;
        setForm(f => ({ ...f, [field]: [...(f[field] || []), value.trim()] }));
        setter('');
    };
    const removeFromArray = (field, i) => setForm(f => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));

    const addSection = () => {
        setForm(f => ({ ...f, sections: [...f.sections, { title: `Section ${f.sections.length + 1}`, order: f.sections.length + 1, lessons: [] }] }));
    };

    const addLesson = (si) => {
        const sections = [...form.sections];
        sections[si] = { ...sections[si], lessons: [...sections[si].lessons, { title: 'New Lesson', description: '', videoUrl: '', duration: 0, isPreview: false, order: sections[si].lessons.length + 1, content: '' }] };
        setForm(f => ({ ...f, sections }));
    };

    const updateSection = (si, key, val) => {
        const sections = [...form.sections];
        sections[si] = { ...sections[si], [key]: val };
        setForm(f => ({ ...f, sections }));
    };

    const updateLesson = (si, li, key, val) => {
        const sections = [...form.sections];
        sections[si].lessons[li] = { ...sections[si].lessons[li], [key]: val };
        setForm(f => ({ ...f, sections }));
    };

    const deleteSection = (si) => setForm(f => ({ ...f, sections: f.sections.filter((_, i) => i !== si) }));
    const deleteLesson = (si, li) => {
        const sections = [...form.sections];
        sections[si].lessons = sections[si].lessons.filter((_, i) => i !== li);
        setForm(f => ({ ...f, sections }));
    };

    const handleSubmit = async (e, publish = false) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.category) {
            toast.error('Please fill title, description, and category'); return;
        }
        setSaving(true);
        try {
            const payload = { ...form, status: publish ? 'pending' : 'draft', isPublished: publish };
            const { data } = await api.post('/courses', payload);
            toast.success(publish ? 'Course submitted for review!' : 'Course saved as draft!');
            navigate(`/instructor/courses/${data.course._id}/edit`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create course');
        } finally { setSaving(false); }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">Create New Course</h1>
                <p className="page-subtitle">Build and share your knowledge with the world</p>
            </div>

            <form>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px' }}>
                    {/* Main content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Basic Info */}
                        <div className="card">
                            <div className="card-header"><h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Basic Information</h3></div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="form-group">
                                    <label className="form-label">Course Title *</label>
                                    <input className="form-input" placeholder="e.g. Complete React Developer Course" value={form.title} onChange={e => setField('title', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Short Description</label>
                                    <textarea className="form-input" rows={2} placeholder="Brief summary (shown on course card)" value={form.shortDescription} onChange={e => setField('shortDescription', e.target.value)} style={{ resize: 'vertical' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Full Description *</label>
                                    <textarea className="form-input" rows={6} placeholder="Describe your course in detail..." value={form.description} onChange={e => setField('description', e.target.value)} required style={{ resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
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
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Price (₹) — 0 for free</label>
                                        <input className="form-input" type="number" min={0} value={form.price} onChange={e => setField('price', Number(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Language</label>
                                        <input className="form-input" value={form.language} onChange={e => setField('language', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Thumbnail URL</label>
                                    <input className="form-input" placeholder="https://..." value={form.thumbnail} onChange={e => setField('thumbnail', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        {['whatYouLearn', 'requirements'].map(field => (
                            <div key={field} className="card">
                                <div className="card-header">
                                    <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>{field === 'whatYouLearn' ? "What Students Will Learn" : "Requirements"}</h3>
                                </div>
                                <div className="card-body">
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                        <input
                                            className="form-input"
                                            placeholder={field === 'whatYouLearn' ? 'e.g. Build real-world apps with React' : 'e.g. Basic JavaScript knowledge'}
                                            value={field === 'whatYouLearn' ? newWyll : newReq}
                                            onChange={e => field === 'whatYouLearn' ? setNewWyll(e.target.value) : setNewReq(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToArray(field, field === 'whatYouLearn' ? newWyll : newReq, field === 'whatYouLearn' ? setNewWyll : setNewReq); } }}
                                        />
                                        <button type="button" className="btn btn-primary" onClick={() => addToArray(field, field === 'whatYouLearn' ? newWyll : newReq, field === 'whatYouLearn' ? setNewWyll : setNewReq)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    {form[field]?.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '0.875rem', flex: 1 }}>✓ {item}</span>
                                            <button type="button" onClick={() => removeFromArray(field, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Curriculum */}
                        <div className="card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>Course Curriculum</h3>
                                <button type="button" className="btn btn-outline btn-sm" onClick={addSection}>
                                    <Plus size={14} /> Add Section
                                </button>
                            </div>
                            <div className="card-body">
                                {form.sections.length === 0 && (
                                    <div className="empty-state" style={{ padding: '32px 16px' }}>
                                        <div className="empty-icon"><BookOpen size={24} /></div>
                                        <div className="empty-title" style={{ fontSize: '0.9rem' }}>No sections yet</div>
                                        <p className="empty-desc">Add sections to organize your course content</p>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={addSection}>Add First Section</button>
                                    </div>
                                )}
                                {form.sections.map((section, si) => (
                                    <div key={si} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '16px', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                                            <input
                                                className="form-input"
                                                style={{ flex: 1, padding: '6px 12px' }}
                                                value={section.title}
                                                onChange={e => updateSection(si, 'title', e.target.value)}
                                                placeholder="Section title"
                                            />
                                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => addLesson(si)}>
                                                <Plus size={14} /> Lesson
                                            </button>
                                            <button type="button" onClick={() => deleteSection(si)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div style={{ padding: '12px 16px' }}>
                                            {section.lessons.map((lesson, li) => (
                                                <div key={li} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: '8px', alignItems: 'center', padding: '8px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: '6px' }}>
                                                    <input className="form-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }} value={lesson.title} onChange={e => updateLesson(si, li, 'title', e.target.value)} placeholder="Lesson title" />
                                                    <input className="form-input" style={{ padding: '6px 10px', fontSize: '0.8rem' }} value={lesson.videoUrl} onChange={e => updateLesson(si, li, 'videoUrl', e.target.value)} placeholder="YouTube URL" />
                                                    <input className="form-input" style={{ padding: '6px 10px', fontSize: '0.8rem', width: '70px' }} type="number" value={lesson.duration} onChange={e => updateLesson(si, li, 'duration', Number(e.target.value))} placeholder="Sec" />
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                        <input type="checkbox" checked={lesson.isPreview} onChange={e => updateLesson(si, li, 'isPreview', e.target.checked)} />
                                                        Preview
                                                    </label>
                                                    <button type="button" onClick={() => deleteLesson(si, li)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {section.lessons.length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    No lessons yet. <button type="button" onClick={() => addLesson(si)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>Add a lesson</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card" style={{ position: 'sticky', top: '88px' }}>
                            <div className="card-header"><h3 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Publish Course</h3></div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Save as draft to edit later, or submit for admin review to publish.
                                </p>
                                <button type="button" onClick={e => handleSubmit(e, false)} className="btn btn-outline w-full" disabled={saving} style={{ justifyContent: 'center' }}>
                                    <Save size={16} /> Save as Draft
                                </button>
                                <button type="button" onClick={e => handleSubmit(e, true)} className="btn btn-primary w-full" disabled={saving} style={{ justifyContent: 'center' }}>
                                    <Eye size={16} /> {saving ? 'Saving...' : 'Submit for Review'}
                                </button>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="card">
                            <div className="card-header"><h3 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Tags</h3></div>
                            <div className="card-body">
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <input className="form-input" value={newTag} onChange={e => setNewTag(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToArray('tags', newTag, setNewTag); } }}
                                        placeholder="e.g. react, javascript" style={{ padding: '8px 12px' }} />
                                    <button type="button" className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={() => addToArray('tags', newTag, setNewTag)}>
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {form.tags.map((tag, i) => (
                                        <span key={i} className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => removeFromArray('tags', i)}>
                                            {tag} ✕
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
