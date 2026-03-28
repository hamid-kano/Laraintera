import ShopLayout from '@/Layouts/ShopLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faSlidersH, faHistory } from '@fortawesome/free-solid-svg-icons';

interface Movement {
    id: number; type: string; quantity: number;
    reason: string; stock_before: number; stock_after: number;
    created_at: string;
}

interface Product {
    id: number; name: string; sku: string; category: string;
    price: number; cost: number; stock: number; reorder_point: number;
    description: string;
}

interface Props {
    product: Product;
    history: { data: Movement[] };
}

const TYPE_CONFIG: Record<string, { label: string; variant: 'success' | 'danger' | 'info' | 'warning'; icon: any }> = {
    in:         { label: 'وارد',    variant: 'success', icon: faArrowUp },
    out:        { label: 'صادر',   variant: 'danger',  icon: faArrowDown },
    transfer:   { label: 'تحويل',  variant: 'info',    icon: faSlidersH },
    adjustment: { label: 'تسوية',  variant: 'warning', icon: faSlidersH },
};

export default function ProductDetail({ product, history }: Props) {
    const [activeTab, setActiveTab] = useState<'receive' | 'deduct' | 'adjust'>('receive');

    const receiveForm = useForm({ quantity: 1, reason: '', reference_id: '' });
    const deductForm  = useForm({ quantity: 1, reason: '' });
    const adjustForm  = useForm({ actual_count: product.stock, notes: '' });

    const isLow = product.stock <= product.reorder_point;

    return (
        <ShopLayout>
            <Head title={product.name} />

            <PageHeader
                breadcrumbs={[
                    { label: 'الأدمن', href: route('admin.dashboard') },
                    { label: 'المخزون', href: route('inventory.index') },
                    { label: product.name },
                ]}
                title={product.name}
                subtitle={`SKU: ${product.sku}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* معلومات المنتج */}
                <div className="lg:col-span-1 space-y-4">
                    <Card title="معلومات المنتج">
                        <div className="space-y-3 text-sm">
                            {[
                                { label: 'الفئة',         value: product.category },
                                { label: 'سعر البيع',     value: `$${product.price}` },
                                { label: 'التكلفة',       value: `$${product.cost}` },
                                { label: 'هامش الربح',    value: `${product.cost > 0 ? (((product.price - product.cost) / product.price) * 100).toFixed(1) : 0}%` },
                                { label: 'نقطة إعادة الطلب', value: product.reorder_point },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between">
                                    <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                                    <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>المخزون الحالي</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold" style={{ color: isLow ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                        {product.stock}
                                    </span>
                                    <Badge variant={isLow ? 'danger' : 'success'} dot>
                                        {isLow ? 'منخفض' : 'متاح'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* عمليات المخزون */}
                    <Card title="عمليات المخزون">
                        {/* Tabs */}
                        <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
                            {[
                                { key: 'receive', label: 'استلام', icon: faArrowUp },
                                { key: 'deduct',  label: 'سحب',    icon: faArrowDown },
                                { key: 'adjust',  label: 'تسوية',  icon: faSlidersH },
                            ].map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors"
                                    style={activeTab === key
                                        ? { background: 'var(--color-surface)', color: 'var(--color-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                                        : { color: 'var(--color-text-muted)' }
                                    }
                                >
                                    <FontAwesomeIcon icon={icon} className="w-3 h-3" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Receive Form */}
                        {activeTab === 'receive' && (
                            <form onSubmit={(e) => { e.preventDefault(); receiveForm.post(route('inventory.receive', product.id)); }} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-strong)' }}>الكمية</label>
                                    <input type="number" min="1" value={receiveForm.data.quantity}
                                        onChange={(e) => receiveForm.setData('quantity', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-strong)' }}>السبب</label>
                                    <input type="text" value={receiveForm.data.reason}
                                        onChange={(e) => receiveForm.setData('reason', e.target.value)}
                                        placeholder="مثال: استلام من المورد"
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                                </div>
                                <button type="submit" disabled={receiveForm.processing}
                                    className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                                    style={{ background: 'var(--color-success)' }}>
                                    ✅ تأكيد الاستلام
                                </button>
                            </form>
                        )}

                        {/* Deduct Form */}
                        {activeTab === 'deduct' && (
                            <form onSubmit={(e) => { e.preventDefault(); deductForm.post(route('inventory.deduct', product.id)); }} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-strong)' }}>الكمية</label>
                                    <input type="number" min="1" max={product.stock} value={deductForm.data.quantity}
                                        onChange={(e) => deductForm.setData('quantity', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-strong)' }}>السبب</label>
                                    <input type="text" value={deductForm.data.reason}
                                        onChange={(e) => deductForm.setData('reason', e.target.value)}
                                        placeholder="مثال: بيع، تلف، هدية"
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                                </div>
                                <button type="submit" disabled={deductForm.processing}
                                    className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                                    style={{ background: 'var(--color-danger)' }}>
                                    ⬇ تأكيد السحب
                                </button>
                            </form>
                        )}

                        {/* Adjust Form */}
                        {activeTab === 'adjust' && (
                            <form onSubmit={(e) => { e.preventDefault(); adjustForm.post(route('inventory.adjust', product.id)); }} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-strong)' }}>
                                        العدد الفعلي (الجرد)
                                    </label>
                                    <input type="number" min="0" value={adjustForm.data.actual_count}
                                        onChange={(e) => adjustForm.setData('actual_count', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                                        الفرق: {adjustForm.data.actual_count - product.stock > 0 ? '+' : ''}{adjustForm.data.actual_count - product.stock}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-strong)' }}>ملاحظات</label>
                                    <textarea value={adjustForm.data.notes}
                                        onChange={(e) => adjustForm.setData('notes', e.target.value)}
                                        placeholder="سبب التسوية..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                                </div>
                                <button type="submit" disabled={adjustForm.processing}
                                    className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                                    style={{ background: 'var(--color-warning)' }}>
                                    ⚖ تأكيد التسوية
                                </button>
                            </form>
                        )}
                    </Card>
                </div>

                {/* سجل الحركات */}
                <div className="lg:col-span-2">
                    <Card title="سجل حركات المخزون" subtitle={`${history.data.length} حركة`}>
                        <div className="space-y-2">
                            {history.data.length === 0 ? (
                                <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
                                    <FontAwesomeIcon icon={faHistory} className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">لا توجد حركات بعد</p>
                                </div>
                            ) : history.data.map((movement) => {
                                const config = TYPE_CONFIG[movement.type] ?? TYPE_CONFIG['in'];
                                return (
                                    <div key={movement.id} className="flex items-center gap-4 p-3 rounded-lg border"
                                        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}>
                                        <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
                                            style={{ background: `rgba(var(--color-${config.variant === 'success' ? 'success' : config.variant === 'danger' ? 'danger' : 'warning'}), 0.1)` }}>
                                            <FontAwesomeIcon icon={config.icon} className="w-3.5 h-3.5"
                                                style={{ color: `var(--color-${config.variant === 'success' ? 'success' : config.variant === 'danger' ? 'danger' : 'warning'})` }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={config.variant}>{config.label}</Badge>
                                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-strong)' }}>
                                                    {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                                                </span>
                                            </div>
                                            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
                                                {movement.reason}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-xs font-medium" style={{ color: 'var(--color-text-strong)' }}>
                                                {movement.stock_before} → {movement.stock_after}
                                            </div>
                                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {new Date(movement.created_at).toLocaleDateString('ar-SA')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </ShopLayout>
    );
}
