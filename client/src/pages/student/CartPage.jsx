import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { Trash2, ShoppingCart, Plus, Minus, CreditCard, BookOpen, Clock, Users } from 'lucide-react';

export default function CartPage() {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [token, navigate]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart');
            setCartItems(data.cartItems || []);
            setTotalPrice(data.totalPrice || 0);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (courseId) => {
        setRemoving(courseId);
        try {
            await api.delete(`/cart/remove/${courseId}`);
            setCartItems(prev => prev.filter(item => item.courseId._id !== courseId));
            const removedItem = cartItems.find(item => item.courseId._id === courseId);
            setTotalPrice(prev => prev - (removedItem?.price || 0));
            toast.success('Course removed from cart');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove course');
        } finally {
            setRemoving(null);
        }
    };

    const formatDuration = (secs) => {
        if (!secs) return '0m';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const handleCheckout = () => {
        // For now, just show a message. In a real app, this would integrate with payment
        toast.success('🎉 Proceeding to checkout...');
        // TODO: Implement payment integration
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner" />
                <p style={{ color: 'var(--text-muted)' }}>Loading cart...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{ background: 'var(--gradient-hero)', padding: '48px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <ShoppingCart size={32} color="white" />
                        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', margin: 0 }}>
                            My Cart
                        </h1>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                        {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in your cart
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '32px 24px' }}>
                {cartItems.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <ShoppingCart size={48} />
                        </div>
                        <div className="empty-title">Your cart is empty</div>
                        <p className="empty-desc">
                            Add courses to your cart to get started with your learning journey
                        </p>
                        <Link to="/courses" className="btn btn-primary">
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
                        {/* Cart Items */}
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {cartItems.map((item) => (
                                    <div key={item._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            {/* Course Thumbnail */}
                                            <div style={{ width: '200px', height: '120px', flexShrink: 0 }}>
                                                <img
                                                    src={item.courseId.thumbnail}
                                                    alt={item.courseId.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>

                                            {/* Course Details */}
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                        {item.courseId.title}
                                                    </h3>
                                                    <p style={{ margin: '4px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                        by {item.courseId.instructor?.name}
                                                    </p>
                                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <BookOpen size={14} /> {item.courseId.totalLessons} lessons
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Clock size={14} /> {formatDuration(item.courseId.totalDuration)}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Users size={14} /> {item.courseId.enrolledCount?.toLocaleString()} students
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                                        ₹{item.price.toLocaleString()}
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.courseId._id)}
                                                        disabled={removing === item.courseId._id}
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ color: 'var(--error)', gap: '6px' }}
                                                    >
                                                        <Trash2 size={16} />
                                                        {removing === item.courseId._id ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="card" style={{ position: 'sticky', top: '80px' }}>
                                <h3 style={{ fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
                                    Order Summary
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cartItems.length} courses)</span>
                                        <span style={{ fontWeight: '600' }}>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Tax</span>
                                        <span style={{ fontWeight: '600' }}>₹0</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700' }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--primary)' }}>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="btn btn-primary btn-lg"
                                    style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                                >
                                    <CreditCard size={20} />
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/courses"
                                    className="btn btn-ghost"
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
