import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Clock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export default function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        api.get(`/quizzes/${quizId}`)
            .then(({ data }) => {
                setQuiz(data.quiz);
                if (data.quiz.timeLimit > 0) setTimeLeft(data.quiz.timeLimit * 60);
            })
            .catch(() => toast.error('Quiz not found'))
            .finally(() => setLoading(false));
    }, [quizId]);

    const handleSubmit = async () => {
        const answerArray = quiz.questions.map((q, qi) => ({
            questionIndex: qi,
            selectedOption: answers[qi] ?? -1
        }));
        try {
            const { data } = await api.post(`/quizzes/${quizId}/attempt`, { answers: answerArray, timeTaken: 0 });
            setResult(data.attempt);
            setSubmitted(true);
            if (data.attempt.passed) toast.success(`🎉 You passed with ${data.attempt.score}%!`);
            else toast.error(`Score: ${data.attempt.score}%. Need ${quiz.passingScore}% to pass.`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit');
        }
    };

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;
    if (!quiz) return <div className="empty-state"><div className="empty-title">Quiz not found</div></div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 0' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)', padding: '28px', color: 'white', marginBottom: '28px' }}>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>{quiz.title}</h1>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                        <span>{quiz.questions?.length} questions</span>
                        {quiz.timeLimit > 0 && <span><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />{quiz.timeLimit} minutes</span>}
                        <span>Passing: {quiz.passingScore}%</span>
                    </div>
                </div>

                {/* Result */}
                {submitted && result && (
                    <div style={{
                        background: result.passed ? '#d1fae5' : '#fee2e2',
                        border: `1px solid ${result.passed ? '#a7f3d0' : '#fca5a5'}`,
                        borderRadius: 'var(--radius-xl)', padding: '28px', textAlign: 'center', marginBottom: '28px'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>{result.passed ? '🎉' : '😔'}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: result.passed ? '#065f46' : '#991b1b' }}>
                            {result.passed ? 'Congratulations! You Passed!' : 'Better luck next time!'}
                        </div>
                        <div style={{ fontSize: '1rem', color: result.passed ? '#047857' : '#b91c1c', marginTop: '8px' }}>
                            Score: <strong>{result.score}%</strong> ({result.earnedPoints}/{result.totalPoints} points)
                        </div>
                    </div>
                )}

                {/* Questions */}
                {quiz.questions?.map((q, qi) => (
                    <div key={qi} className="card" style={{ marginBottom: '20px' }}>
                        <div className="card-body">
                            <div style={{ fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <span style={{ color: 'var(--primary)', marginRight: '8px' }}>Q{qi + 1}.</span>
                                {q.question}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {q.options?.map((opt, oi) => {
                                    let cls = 'quiz-option';
                                    if (submitted && result) {
                                        const ans = result.answers?.[qi];
                                        if (oi === answers[qi]) {
                                            cls += ans?.isCorrect ? ' correct' : ' wrong';
                                        }
                                    } else if (answers[qi] === oi) {
                                        cls += ' selected';
                                    }
                                    return (
                                        <div key={oi} className={cls}
                                            onClick={() => { if (!submitted) setAnswers(a => ({ ...a, [qi]: oi })); }}
                                        >
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                border: `2px solid ${answers[qi] === oi ? 'var(--primary)' : 'var(--border)'}`,
                                                background: answers[qi] === oi ? 'var(--primary)' : 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                {answers[qi] === oi && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
                                            </div>
                                            <span style={{ fontSize: '0.875rem' }}>{opt.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {submitted && q.explanation && (
                                <div style={{ marginTop: '12px', padding: '12px', background: '#f0f9ff', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#0369a1' }}>
                                    💡 {q.explanation}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Submit */}
                {!submitted && (
                    <button onClick={handleSubmit} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                        Submit Quiz <ArrowRight size={18} />
                    </button>
                )}
                {submitted && (
                    <button onClick={() => navigate(-1)} className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                        Back to Course
                    </button>
                )}
            </div>
        </div>
    );
}
