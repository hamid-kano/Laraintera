import ShopLayout from '@/Layouts/ShopLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';

// ─────────────────────────────────────────────────────
// 📌 هذه الصفحة تُظهر الفرق بين طريقتين:
//
// Inertia:  البيانات تأتي كـ Props من Laravel مباشرة
//           لا تحتاج fetch أو axios
//           لا تحتاج useState أو useEffect
//
// API:      تطلب البيانات بنفسك بعد تحميل الصفحة
//           تحتاج useState + useEffect + axios
//           تحتاج Token للمصادقة
// ─────────────────────────────────────────────────────

interface Product {
    id: number; name: string; price: number;
    category: string; stock: number; image: string;
}

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    time: number | null;
}

export default function ApiExplorer() {
    const { t } = useTranslation();

    // ── State ──────────────────────────────────────────
    const [token, setToken]   = useState('');
    const [email, setEmail]   = useState('test@example.com');
    const [password, setPassword] = useState('password');

    const [auth, setAuth]     = useState<ApiState<{ token: string; user: any }>>({ data: null, loading: false, error: null, time: null });
    const [products, setProducts] = useState<ApiState<{ data: Product[]; total: number }>>({ data: null, loading: false, error: null, time: null });
    const [cart, setCart]     = useState<ApiState<any>>({ data: null, loading: false, error: null, time: null });
    const [orders, setOrders] = useState<ApiState<any>>({ data: null, loading: false, error: null, time: null });

    // ── Helpers ────────────────────────────────────────
    const apiCall = async <T,>(
        setter: (s: ApiState<T>) => void,
        fn: () => Promise<T>
    ) => {
        setter({ data: null, loading: true, error: null, time: null });
        const start = Date.now();
        try {
            const data = await fn();
            setter({ data, loading: false, error: null, time: Date.now() - start });
        } catch (e: any) {
            setter({ data: null, loading: false, error: e.response?.data?.message || e.message, time: Date.now() - start });
        }
    };

    // ── API Calls ──────────────────────────────────────

    // 📌 الفرق #1: تحتاج تسجيل دخول منفصل للحصول على Token
    const handleLogin = () => apiCall(setAuth, async () => {
        const res = await axios.post('/api/login', { email, password });
        setToken(res.data.token);
        return res.data;
    });

    // 📌 الفرق #2: المنتجات متاحة بدون Token (public endpoint)
    const fetchProducts = () => apiCall(setProducts, async () => {
        const res = await axios.get('/api/products');
        return res.data;
    });

    // 📌 الفرق #3: السلة تحتاج Token في الـ Header
    const fetchCart = () => apiCall(setCart, async () => {
        const res = await axios.get('/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    });

    const fetchOrders = () => apiCall(setOrders, async () => {
        const res = await axios.get('/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    });

    return (
        <ShopLayout>
            <Head title="API Explorer" />

            <PageHeader
                breadcrumbs={[
                    { label: t('nav.dashboard'), href: route('dashboard') },
                    { label: 'API Explorer' },
                ]}
                title="🔌 API Explorer"
                subtitle="تجربة عملية للفرق بين Inertia Props و REST API"
            />

            {/* المقارنة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="success">Inertia Props</Badge>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>الطريقة الحالية</span>
                    </div>
                    <pre className="text-xs rounded-lg p-3 overflow-x-auto" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-strong)' }}>{`// Controller
Inertia::render('Products', [
    'products' => Product::all()
]);

// React - لا تحتاج شيء إضافي!
export default function Products({ products }) {
    return products.map(p => ...)
}`}</pre>
                    <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
                        ✅ بسيط — البيانات جاهزة عند تحميل الصفحة<br />
                        ✅ لا Token — Session تلقائي<br />
                        ❌ لا يعمل مع Mobile App
                    </p>
                </div>

                <div className="rounded-xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="info">REST API</Badge>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sanctum Token</span>
                    </div>
                    <pre className="text-xs rounded-lg p-3 overflow-x-auto" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-strong)' }}>{`// React - تحتاج كل هذا
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
    axios.get('/api/products', {
        headers: { Authorization: \`Bearer \${token}\` }
    }).then(res => setData(res.data));
}, []);`}</pre>
                    <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
                        ✅ يعمل مع Mobile App<br />
                        ✅ يعمل مع أي Frontend<br />
                        ❌ أكثر تعقيداً — تحتاج إدارة Token
                    </p>
                </div>
            </div>

            {/* Login */}
            <div className="rounded-xl border overflow-hidden mb-4" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: 'var(--color-success)' }}>POST</span>
                        <code className="text-sm" style={{ color: 'var(--color-text-strong)' }}>/api/login</code>
                    </div>
                    <Badge variant={auth.data ? 'success' : 'default'}>
                        {auth.data ? '✅ مصادق' : 'غير مصادق'}
                    </Badge>
                </div>
                <div className="p-5">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="flex-1 min-w-[180px] px-3 py-2 text-sm rounded-lg border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="flex-1 min-w-[180px] px-3 py-2 text-sm rounded-lg border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                        <button onClick={handleLogin} disabled={auth.loading} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
                            {auth.loading ? '⏳' : 'تسجيل الدخول'}
                        </button>
                    </div>
                    <ResponseBox state={auth} />
                    {token && (
                        <div className="mt-3 p-3 rounded-lg text-xs font-mono break-all" style={{ background: 'var(--color-surface-2)', color: 'var(--color-success)' }}>
                            🔑 Token: {token.slice(0, 40)}...
                        </div>
                    )}
                </div>
            </div>

            {/* Endpoints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointCard
                    method="GET" endpoint="/api/products"
                    label="المنتجات (Public)"
                    auth={false}
                    state={products}
                    onFetch={fetchProducts}
                    renderData={(d: any) => `${d?.data?.length ?? d?.total ?? 0} منتج`}
                />
                <EndpointCard
                    method="GET" endpoint="/api/cart"
                    label="السلة (Protected)"
                    auth={true}
                    hasToken={!!token}
                    state={cart}
                    onFetch={fetchCart}
                    renderData={(d: any) => `${d?.items?.length ?? 0} عنصر — $${d?.total ?? 0}`}
                />
                <EndpointCard
                    method="GET" endpoint="/api/orders"
                    label="الطلبات (Protected)"
                    auth={true}
                    hasToken={!!token}
                    state={orders}
                    onFetch={fetchOrders}
                    renderData={(d: any) => `${Array.isArray(d) ? d.length : 0} طلب`}
                />
            </div>
        </ShopLayout>
    );
}

// ── Sub Components ─────────────────────────────────────

function ResponseBox({ state }: { state: ApiState<any> }) {
    if (state.loading) return <div className="text-xs p-3 rounded-lg animate-pulse" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>⏳ جاري الطلب...</div>;
    if (state.error)   return <div className="text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' }}>❌ {state.error}</div>;
    if (!state.data)   return null;
    return (
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs" style={{ color: 'var(--color-success)' }}>✅ {state.time}ms</span>
            </div>
            <pre className="text-xs p-3 rounded-lg overflow-x-auto max-h-40" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-strong)' }}>
                {JSON.stringify(state.data, null, 2).slice(0, 500)}...
            </pre>
        </div>
    );
}

function EndpointCard({ method, endpoint, label, auth, hasToken, state, onFetch, renderData }: any) {
    return (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: 'var(--color-info)' }}>{method}</span>
                    <code className="text-xs" style={{ color: 'var(--color-text-strong)' }}>{endpoint}</code>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                    {auth && <Badge variant={hasToken ? 'success' : 'warning'} dot>{hasToken ? 'Token موجود' : 'يحتاج Token'}</Badge>}
                </div>
            </div>
            <div className="p-4">
                <button
                    onClick={onFetch}
                    disabled={state.loading || (auth && !hasToken)}
                    className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 mb-3"
                    style={{ background: 'var(--color-primary)' }}
                >
                    {state.loading ? '⏳ جاري...' : '▶ تشغيل'}
                </button>
                {state.data && (
                    <div className="text-center">
                        <div className="text-lg font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{renderData(state.data)}</div>
                        <div className="text-xs" style={{ color: 'var(--color-success)' }}>✅ {state.time}ms</div>
                    </div>
                )}
                {state.error && <div className="text-xs" style={{ color: 'var(--color-danger)' }}>❌ {state.error}</div>}
            </div>
        </div>
    );
}
