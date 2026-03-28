// ── Models ────────────────────────────────────────────

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    in_stock: boolean;
    created_at: string;
}

export interface CartItem {
    id: number;
    quantity: number;
    product: Pick<Product, 'id' | 'name' | 'price' | 'image'>;
}

export interface Order {
    id: number;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Pick<Product, 'name' | 'image'>;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

// ── API Responses ─────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface CartResponse {
    items: CartItem[];
    total: number;
    count: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// ── UI State ──────────────────────────────────────────

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
