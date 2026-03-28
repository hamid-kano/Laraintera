import axios from 'axios';
import type { AuthResponse, CartResponse, Order, PaginatedResponse, Product } from '@/types/shop';

// ── Instance مع interceptor للـ Token ─────────────────
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
    const token  = localStorage.getItem('api_token');
    const lang   = localStorage.getItem('lang') || 'ar';
    if (token) config.headers.Authorization  = `Bearer ${token}`;
    config.headers['Accept-Language'] = lang;
    return config;
});

// ✅ Response interceptor — يعالج الأخطاء بشكل مركزي
// الرسائل تأتي من Backend باللغة الصحيحة تلقائياً
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 — انتهت الجلسة
        if (error.response?.status === 401) {
            localStorage.removeItem('api_token');
        }
        // نرمي الخطأ كما هو ليتعامل معه كل hook بشكل مستقل
        return Promise.reject(error);
    }
);

export { api };

// ── Auth ──────────────────────────────────────────────
export const authService = {
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
