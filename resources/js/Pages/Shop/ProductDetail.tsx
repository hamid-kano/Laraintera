import ShopLayout from '@/Layouts/ShopLayout';
import { Head, useForm } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
}

export default function ProductDetail({ product }: { product: Product }) {
    // 📌 مفهوم Inertia: useForm — يدير الـ state + الإرسال + loading + errors تلقائياً
    const { post, processing } = useForm();

    const addToCart = () => {
        // 📌 يرسل POST لـ CartController::add() بدون كتابة fetch أو axios
        post(route('cart.add', product.id));
    };

    return (
        <ShopLayout>
            <Head title={product.name} />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />

                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                                    {product.category}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-3">{product.name}</h1>
                                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-4xl font-bold text-indigo-600">${product.price}</span>
                                    <span className={`text-sm px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ المخزون'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {/* 📌 مفهوم Inertia: processing يمنع الضغط المزدوج أثناء الإرسال */}
                                <button
                                    onClick={addToCart}
                                    disabled={processing || product.stock === 0}
                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? '⏳ جاري الإضافة...' : '🛒 أضف للسلة'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
