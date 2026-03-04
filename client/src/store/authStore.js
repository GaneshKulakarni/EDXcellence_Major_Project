import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('learnhub_user') || 'null'),
    token: localStorage.getItem('learnhub_token') || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('learnhub_token', data.token);
            localStorage.setItem('learnhub_user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, loading: false });
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            set({ loading: false, error: msg });
            throw new Error(msg);
        }
    },

    register: async (name, email, password, role = 'student') => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            localStorage.setItem('learnhub_token', data.token);
            localStorage.setItem('learnhub_user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, loading: false });
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            set({ loading: false, error: msg });
            throw new Error(msg);
        }
    },

    logout: () => {
        localStorage.removeItem('learnhub_token');
        localStorage.removeItem('learnhub_user');
        set({ user: null, token: null });
    },

    updateUser: (user) => {
        localStorage.setItem('learnhub_user', JSON.stringify(user));
        set({ user });
    },

    fetchMe: async () => {
        try {
            const { data } = await api.get('/auth/me');
            localStorage.setItem('learnhub_user', JSON.stringify(data.user));
            set({ user: data.user });
        } catch {
            get().logout();
        }
    },

    isAuthenticated: () => !!get().token,
    isAdmin: () => get().user?.role === 'admin',
    isInstructor: () => get().user?.role === 'instructor',
    isStudent: () => get().user?.role === 'student',
}));

export default useAuthStore;
