import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, usePage } from '@inertiajs/react';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: { name: string; image: string };
}

interface Order {
    id: number;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    items: OrderItem[];
}

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
    pending:    { label: 'قيد الانتظار', bg: 'rgba(245,158,11,0.1)',  color: 'var(--color-warning)' },
    processing: { label: 'قيد المعالجة', bg: 'rgba(59,130,246,0.1)',  color: 'var(--color-info)' },
    completed:  { label: 'مكتمل',        bg: 'rgba(16,185,129,0.1)',  color: 'var(--color-success)' },
    cancelled:  { label: 'ملغي',         bg: 'rgba(239,68,68,0.1)',   color: 'var(--color-danger)' },
};

export default function Orders({ orders }: { orders: Order[] }) {
    const { flash } = usePage().props as any;

    return (
        <ShopLayout>
            <Head title="طلباتي" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-strong)' }}>📦 طلباتي</h1>
            </div>

            {flash?.success && (
                <div
                    className="px-4 py-3 rounded-xl border mb-6 text-sm"
                    style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                >
                    ✅ {flash.success}
                </div>
            )}

            {orders.length === 0 ? (
                <div
                    className="rounded-xl border p-16 text-center"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                    <p className="text-5xl mb-4">📦</p>
                    <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>لا توجد طلبات بعد</p>
                    <Link
                        href={route('products.index')}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium text-white"
                        style={{ background: 'var(--color-primary)' }}
                    >
                        ابدأ التسوق
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const s = STATUS[order.status];
                        return (
                            <div
                                key={order.id}
                                className="rounded-xl border overflow-hidden"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                            >
                                {/* Header */}
                                <div
                                    className="flex items-center justify-between px-5 py-3 border-b"
                                    style={{ borderColor: 'var(--color-border)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-sm" style={{ color: 'var(--color-text-strong)' }}>
                                            طلب #{order.id}
                                        </span>
                                        <span
                                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                                            style={{ background: s.bg, color: s.color }}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>${order.total}</p>
                                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                            {new Date(order.created_at).toLocaleDateString('ar-SA')}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 px-5 py-3 border-b last:border-0"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        >
                                            <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" />
                                            <span className="flex-1 text-sm" style={{ color: 'var(--color-text)' }}>{item.product.name}</span>
                                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>× {item.quantity}</span>
                                            <span className="text-sm font-medium" style={{ color: 'var(--color-text-strong)' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ShopLayout>
    );
}
