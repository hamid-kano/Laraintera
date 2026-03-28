import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { productService, cartService, authService } from '@/services/api';
import type { AsyncState, AuthResponse, CartResponse, PaginatedResponse, Product } from '@/types/shop';

// ── extractError ──────────────────────────────────────
// أخطاء Backend  → تأتي مترجمة من Laravel مباشرة
// أخطاء Network  → تُترجم من Frontend (errors.*)
function extractError(e: any, t: (k: string) => string): string {
    if (!e.response)               return t('errors.network');
    if (e.response.status === 401) return t('errors.unauthorized');
    if (e.response.status >= 500)  return t('errors.server');
    return e.response?.data?.message ?? e.message ?? t('errors.unknown');
}

// ── useProducts ───────────────────────────────────────
export function useProducts(params?: { search?: string; category?: string }) {
    const { t } = useTranslation();
    const [state, setState] = useState<AsyncState<PaginatedResponse<Product>>>({
        data: null, loading: true, error: null,
    });

    useEffect(() => {
        setState(s => ({ ...s, loading: true }));
        productService.getAll(params)
            .then(data => setState({ data, loading: false, error: null }))
            .catch(e   => setState({ data: null, loading: false, error: extractError(e, t) }));
    }, [params?.search, params?.category]);

    return state;
}

// ── useCart ───────────────────────────────────────────
export function useCart() {
    const { t } = useTranslation();
    const [state, setState] = useState<AsyncState<CartResponse>>({
        data: null, loading: true, error: null,
    });

    const fetchCart = () => {
        setState(s => ({ ...s, loading: true }));
        cartService.get()
            .then(data => setState({ data, loading: false, error: null }))
            .catch(e   => setState({ data: null, loading: false, error: extractError(e, t) }));
    };

    useEffect(() => { fetchCart(); }, []);

    const addToCart = async (productId: number) => {
        await cartService.add(productId);
        fetchCart();
    };

    const removeFromCart = async (cartItemId: number) => {
        await cartService.remove(cartItemId);
        fetchCart();
    };

    return { ...state, addToCart, removeFromCart, refetch: fetchCart };
}

// ── useApiAuth ────────────────────────────────────────
export function useApiAuth() {
    const { t } = useTranslation();
    const [state, setState] = useState<AsyncState<AuthResponse>>({
        data: null, loading: false, error: null,
    });

    const login = async (email: string, password: string) => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await authService.login(email, password);
            setState({ data, loading: false, error: null });
            return data;
        } catch (e: any) {
            setState({ data: null, loading: false, error: extractError(e, t) });
            throw e;
        }
    };

    return { ...state, login };
}
