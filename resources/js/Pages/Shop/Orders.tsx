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

const statusConfig = {
    pending:    { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-700' },
    completed:  { label: 'مكتمل',        color: 'bg-green-100 text-green-700' },
    cancelled:  { label: 'ملغي',         color: 'bg-red-100 text-red-700' },
};

export default function Orders({ orders }: { orders: Order[] }) {
    // 📌 مفهوم Inertia: usePage().props.flash للرسائل المؤقتة بعد redirect
    const { flash } = usePage().props as any;

    return (
        <ShopLayout>
            <Head title="طلباتي" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">📦 طلباتي</h1>

            {/* 📌 مفهوم Inertia: flash message تأتي بعد redirect من checkout */}
            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
                    ✅ {flash.success}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-6xl mb-4">📦</p>
                    <p className="text-xl text-gray-500 mb-6">لا توجد طلبات بعد</p>
                    <Link href={route('products.index')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                        ابدأ التسوق
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const status = statusConfig[order.status];
                        return (
                            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* رأس الطلب */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-gray-900">طلب #{order.id}</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600 text-lg">${order.total}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString('ar-SA')}
                                        </p>
                                    </div>
                                </div>

                                {/* منتجات الطلب */}
                                <div className="divide-y divide-gray-50">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 px-6 py-3">
                                            <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                                            <span className="flex-1 text-gray-700">{item.product.name}</span>
                                            <span className="text-gray-500 text-sm">× {item.quantity}</span>
                                            <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
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
