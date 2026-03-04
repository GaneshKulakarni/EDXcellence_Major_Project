import { useState, useEffect } from 'react';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { ClipboardList, Plus, Trash2, X } from 'lucide-react';

export default function InstructorQuizzesPage() {
    const { user } = useAuthStore();
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', course: '', passingScore: 70, timeLimit: 0, maxAttempts: 3, questions: [] });

    useEffect(() => {
        Promise.all([
            api.get('/courses/instructor/my-courses'),
        ]).then(([coursesRes]) => {
            setCourses(coursesRes.data.courses || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const addQuestion = () => {
        setForm(f => ({ ...f, questions: [...f.questions, { question: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], explanation: '', points: 1 }] }));
    };

    const updateQuestion = (qi, key, val) => {
        const qs = [...form.questions];
        qs[qi] = { ...qs[qi], [key]: val };
        setForm(f => ({ ...f, questions: qs }));
    };

    const updateOption = (qi, oi, key, val) => {
        const qs = [...form.questions];
        if (key === 'isCorrect' && val) {
            qs[qi].options = qs[qi].options.map((o, i) => ({ ...o, isCorrect: i === oi }));
        } else {
            qs[qi].options[oi] = { ...qs[qi].options[oi], [key]: val };
        }
        setForm(f => ({ ...f, questions: qs }));
    };

    const submitQuiz = async (e) => {
        e.preventDefault();
        if (!form.course) { toast.error('Select a course'); return; }
        if (form.questions.length === 0) { toast.error('Add at least one question'); return; }
        try {
            const { data } = await api.post('/quizzes', { ...form, instructor: user?._id });
            setQuizzes(q => [data.quiz, ...q]);
            toast.success('Quiz created!');
            setShowModal(false);
            setForm({ title: '', description: '', course: '', passingScore: 70, timeLimit: 0, maxAttempts: 3, questions: [] });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create quiz');
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Quizzes</h1>
                        <p className="page-subtitle">Create and manage course quizzes</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} /> Create Quiz
                    </button>
                </div>
            </div>

            {quizzes.length === 0 && (
                <div className="empty-state card" style={{ padding: '60px' }}>
                    <div className="empty-icon"><ClipboardList size={32} /></div>
                    <div className="empty-title">No quizzes yet</div>
                    <p className="empty-desc">Create quizzes to test your students' knowledge</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>Create First Quiz</button>
                </div>
            )}

            {/* Quiz Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Create Quiz</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitQuiz}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Quiz Title *</label>
                                    <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Module 1 Assessment" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Course *</label>
                                    <select className="form-input form-select" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required>
                                        <option value="">Select a course</option>
                                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Passing Score (%)</label>
                                        <input className="form-input" type="number" min={1} max={100} value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: Number(e.target.value) }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time Limit (min, 0=none)</label>
                                        <input className="form-input" type="number" min={0} value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: Number(e.target.value) }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Max Attempts</label>
                                        <input className="form-input" type="number" min={1} value={form.maxAttempts} onChange={e => setForm(f => ({ ...f, maxAttempts: Number(e.target.value) }))} />
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Questions ({form.questions.length})</span>
                                        <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion}>
                                            <Plus size={14} /> Add Question
                                        </button>
                                    </div>

                                    {form.questions.map((q, qi) => (
                                        <div key={qi} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                                <div className="form-group" style={{ flex: 1 }}>
                                                    <label className="form-label">Question {qi + 1}</label>
                                                    <input className="form-input" value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)} placeholder="Enter question..." required />
                                                </div>
                                                <button type="button" onClick={() => setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }))}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', alignSelf: 'flex-end', marginBottom: '0', padding: '11px 8px' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div style={{ display: 'flexCol', flexDirection: 'column', gap: '8px' }}>
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                        <input type="radio" name={`correct-${qi}`} checked={opt.isCorrect} onChange={() => updateOption(qi, oi, 'isCorrect', true)} style={{ accentColor: 'var(--primary)' }} />
                                                        <input className="form-input" style={{ flex: 1, padding: '8px 12px' }} value={opt.text}
                                                            onChange={e => updateOption(qi, oi, 'text', e.target.value)} placeholder={`Option ${oi + 1}`} required />
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                ☝️ Select the radio button to mark the correct answer
                                            </div>
                                        </div>
                                    ))}

                                    {form.questions.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            Click "Add Question" to begin building your quiz
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Quiz</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
