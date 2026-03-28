import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
    };
}

interface Props {
    cartItems: CartItem[];
    total: number;
}

export default function Cart({ cartItems, total }: Props) {
    // 📌 مفهوم Inertia: useForm للـ checkout — يرسل POST ثم Inertia يتبع الـ redirect تلقائياً
    const { post, processing } = useForm();

    const checkout = () => post(route('orders.checkout'));

    // 📌 مفهوم Inertia: useForm منفصل لكل عملية (حذف / تحديث)
    const removeForm = useForm();
    const updateForm = useForm<{ quantity: number }>({ quantity: 1 });

    const removeItem = (itemId: number) => {
        removeForm.delete(route('cart.remove', itemId));
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        updateForm.setData('quantity', quantity);
        updateForm.patch(route('cart.update', itemId));
    };

    return (
        <ShopLayout>
            <Head title="السلة" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 سلة التسوق</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-6xl mb-4">🛒</p>
                    <p className="text-xl text-gray-500 mb-6">السلة فارغة</p>
                    <Link href={route('products.index')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                        تصفح المنتجات
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* قائمة المنتجات */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-center shadow-sm">
                                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                    <p className="text-indigo-600 font-bold">${item.product.price}</p>
                                </div>

                                {/* 📌 مفهوم Inertia: كل ضغطة ترسل request وتحدث الـ props تلقائياً */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="font-bold text-gray-900 w-20 text-right">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </span>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-400 hover:text-red-600 transition-colors text-lg"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ملخص الطلب */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-fit">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h2>
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>المجموع الفرعي</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>الشحن</span>
                            <span className="text-green-600">مجاني</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                            <span>الإجمالي</span>
                            <span className="text-indigo-600">${total.toFixed(2)}</span>
                        </div>

                        {/* 📌 مفهوم Inertia: processing من useForm يعطل الزر أثناء الإرسال */}
                        <button
                            onClick={checkout}
                            disabled={processing}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? '⏳ جاري المعالجة...' : '✅ إتمام الشراء'}
                        </button>
                    </div>
                </div>
            )}
        </ShopLayout>
    );
}
