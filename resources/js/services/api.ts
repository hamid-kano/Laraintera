import axios from 'axios';
import type { AuthResponse, CartResponse, Order, PaginatedResponse, Product } from '@/types/shop';

// ── Instance ──────────────────────────────────────────
const api = axios.create({
    baseURL: '/api',
    // 📌 withCredentials = true → يرسل Session Cookie تلقائياً
    // هذا يسمح للـ API باستخدام نفس Session الـ Inertia
    withCredentials: true,
    withXSRFToken: true, // يرسل CSRF token تلقائياً
});

api.interceptors.request.use((config) => {
    const lang = localStorage.getItem('lang') || 'ar';
    config.headers['Accept-Language'] = lang;

    // Token فقط إذا كان موجوداً (للـ Mobile / Third Party)
    // إذا لم يكن موجوداً → يعتمد على Session Cookie تلقائياً
    const token = localStorage.getItem('api_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('api_token');
        }
        return Promise.reject(error);
    }
);

export { api };

// ── Auth ──────────────────────────────────────────────
export const authService = {
    // للـ Mobile / Third Party فقط — يعطي Token
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/login', { email, password });
        localStorage.setItem('api_token', data.token);
        return data;
    },

    logout: async (): Promise<void> => {
        await api.post('/logout');
        localStorage.removeItem('api_token');
    },

    me: () => api.get<{ id: number; name: string; email: string }>('/me').then(r => r.data),
};

// ── Products ──────────────────────────────────────────
export const productService = {
    getAll: (params?: { search?: string; category?: string; page?: number }) =>
        api.get<PaginatedResponse<Product>>('/products', { params }).then(r => r.data),

    getOne: (id: number) =>
        api.get<Product>(`/products/${id}`).then(r => r.data),
};

// ── Cart ──────────────────────────────────────────────
export const cartService = {
    get: () =>
        api.get<CartResponse>('/cart').then(r => r.data),

    add: (productId: number) =>
        api.post(`/cart/${productId}`).then(r => r.data),

    remove: (cartItemId: number) =>
        api.delete(`/cart/${cartItemId}`).then(r => r.data),
};

// ── Orders ────────────────────────────────────────────
export const orderService = {
    getAll: () =>
        api.get<Order[]>('/orders').then(r => r.data),

    checkout: () =>
        api.post<{ message: string; order: Order }>('/orders/checkout').then(r => r.data),
};
