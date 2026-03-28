import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

// 📌 مفهوم Inertia: usePage().props تعطيك كل الـ props + Shared Data
export default function ShopLayout({ children }: PropsWithChildren) {
    const { cartCount, auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-xl font-bold text-indigo-600">
                                🛍️ متجري
                            </Link>
                            {/* 📌 مفهوم Inertia: <Link> بدلاً من <a> — تنقل بدون full page reload */}
                            <Link href={route('products.index')} className="text-gray-600 hover:text-indigo-600 transition-colors">
                                المنتجات
                            </Link>
                            <Link href={route('orders.index')} className="text-gray-600 hover:text-indigo-600 transition-colors">
                                طلباتي
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* 📌 مفهوم Inertia: cartCount قادم من Shared Data — يتحدث تلقائياً بعد كل request */}
                            <Link href={route('cart.index')} className="relative flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                🛒 السلة
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <span className="text-sm text-gray-500">{auth?.user?.name}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
