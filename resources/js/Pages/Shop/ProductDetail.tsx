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
    const { post, processing } = useForm();

    return (
        <ShopLayout>
            <Head title={product.name} />

            <div className="max-w-4xl mx-auto">
                <div
                    className="rounded-2xl border overflow-hidden"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />

                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <span
                                    className="text-xs font-medium px-3 py-1 rounded-full"
                                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                                >
                                    {product.category}
                                </span>
                                <h1 className="text-2xl font-bold mt-4 mb-3" style={{ color: 'var(--color-text-strong)' }}>
                                    {product.name}
                                </h1>
                                <p className="leading-relaxed mb-6 text-sm" style={{ color: 'var(--color-text)' }}>
                                    {product.description}
                                </p>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        ${product.price}
                                    </span>
                                    <span
                                        className="text-xs px-3 py-1 rounded-full font-medium"
                                        style={
                                            product.stock > 0
                                                ? { background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }
                                                : { background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)' }
                                        }
                                    >
                                        {product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ المخزون'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => post(route('cart.add', product.id))}
                                disabled={processing || product.stock === 0}
                                className="w-full py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                {processing ? '⏳ جاري الإضافة...' : '🛒 أضف للسلة'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
