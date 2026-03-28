import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface CartItem {
    id: number; quantity: number;
    product: { id: number; name: string; price: number; image: string };
}

export default function Cart({ cartItems, total }: { cartItems: CartItem[]; total: number }) {
    const { t } = useTranslation();
    const { post, processing } = useForm();
    const removeForm = useForm();
    const updateForm = useForm<{ quantity: number }>({ quantity: 1 });

    const removeItem   = (id: number) => removeForm.delete(route('cart.remove', id));
    const updateQty    = (id: number, qty: number) => {
        if (qty < 1) return;
        updateForm.setData('quantity', qty);
        updateForm.patch(route('cart.update', id));
    };

    return (
        <ShopLayout>
            <Head title={t('cart.title')} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-strong)' }}>🛒 {t('cart.title')}</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="rounded-xl border p-16 text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <p className="text-5xl mb-4">🛒</p>
                    <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>{t('cart.empty')}</p>
                    <Link href={route('products.index')} className="px-6 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--color-primary)' }}>
                        {t('cart.browse')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {cartItems.map((item) => (
                            <div key={item.id} className="rounded-xl border p-4 flex gap-4 items-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-strong)' }}>{item.product.name}</p>
                                    <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--color-primary)' }}>${item.product.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>−</button>
                                    <span className="w-6 text-center text-sm font-medium" style={{ color: 'var(--color-text-strong)' }}>{item.quantity}</span>
                                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>+</button>
                                </div>
                                <span className="font-bold text-sm w-16 text-left" style={{ color: 'var(--color-text-strong)' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeItem(item.id)} className="text-lg" style={{ color: 'var(--color-danger)' }}>🗑️</button>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border p-6 h-fit" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-strong)' }}>{t('cart.summary')}</h2>
                        <div className="flex justify-between mb-2 text-sm" style={{ color: 'var(--color-text)' }}>
                            <span>{t('cart.subtotal')}</span><span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-sm">
                            <span style={{ color: 'var(--color-text)' }}>{t('cart.shipping')}</span>
                            <span style={{ color: 'var(--color-success)' }}>{t('cart.free')}</span>
                        </div>
                        <div className="h-px mb-4" style={{ background: 'var(--color-border)' }} />
                        <div className="flex justify-between font-bold mb-6">
                            <span style={{ color: 'var(--color-text-strong)' }}>{t('cart.total')}</span>
                            <span style={{ color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
                        </div>
                        <button onClick={() => post(route('orders.checkout'))} disabled={processing} className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50" style={{ background: 'var(--color-primary)' }}>
                            {processing ? t('cart.processing') : `✅ ${t('cart.checkout')}`}
                        </button>
                    </div>
                </div>
            )}
        </ShopLayout>
    );
}
