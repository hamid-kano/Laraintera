import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faTriangleExclamation, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

interface Product {
    id: number; name: string; sku: string;
    category: string; price: number; cost: number;
    stock: number; reorder_point: number;
}

interface Props {
    products: {
        data: Product[];
        links: any[]; from: number; to: number; total: number;
    };
    lowStockCount: number;
    filters: { search?: string; category?: string; low_stock?: boolean };
}

export default function InventoryProducts({ products, lowStockCount, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('inventory.index'), { ...filters, search: value }, {
            preserveState: true, replace: true,
        });
    };

    const toggleLowStock = () => {
        router.get(route('inventory.index'), {
            ...filters,
            low_stock: !filters.low_stock,
        }, { preserveState: true, replace: true });
    };

    return (
        <ShopLayout>
            <Head title="إدارة المخزون" />

            <PageHeader
                breadcrumbs={[
                    { label: 'الأدمن', href: route('admin.dashboard') },
                    { label: 'المخزون' },
                ]}
                title="🏭 إدارة المخزون"
                subtitle="تتبع المنتجات وحركات المخزون"
                actions={
                    <Link
                        href={route('inventory.index')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ background: 'var(--color-primary)' }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                        منتج جديد
                    </Link>
                }
            />

            {/* تنبيه المخزون المنخفض */}
            {lowStockCount > 0 && (
                <div className="mb-5 px-4 py-3 rounded-xl border flex items-center gap-3"
                    style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">
                        {lowStockCount} منتج وصل لنقطة إعادة الطلب — يحتاج تجديد المخزون
                    </span>
                    <button
                        onClick={toggleLowStock}
                        className="mr-auto text-xs underline"
                    >
                        {filters.low_stock ? 'عرض الكل' : 'عرض المنخفض فقط'}
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-3 mb-5 p-4 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <input
                    type="text"
                    placeholder="بحث بالاسم أو SKU..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 px-4 py-2 text-sm rounded-lg border outline-none"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }}
                />
            </div>

            {/* Table */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            {['المنتج', 'SKU', 'الفئة', 'السعر', 'التكلفة', 'المخزون', 'الحالة', ''].map((h) => (
                                <th key={h} className="text-start px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--color-text-muted)' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.map((product) => {
                            const isLow = product.stock <= product.reorder_point;
                            return (
                                <tr key={product.id} className="hover:bg-black/5 transition-colors"
                                    style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-strong)' }}>
                                            {product.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="text-xs px-2 py-0.5 rounded"
                                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
                                            {product.sku}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text)' }}>
                                        {product.category}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                                        ${product.price}
                                    </td>
                                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text)' }}>
                                        ${product.cost}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-sm font-bold ${isLow ? 'text-red-500' : ''}`}
                                            style={!isLow ? { color: 'var(--color-success)' } : {}}>
                                            {product.stock}
                                        </span>
                                        <span className="text-xs mr-1" style={{ color: 'var(--color-text-muted)' }}>
                                            / {product.reorder_point}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={isLow ? 'danger' : 'success'} dot>
                                            {isLow ? 'منخفض' : 'متاح'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={route('inventory.show', product.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                            <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                                            تفاصيل
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {products.data.length === 0 && (
                    <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
                        <FontAwesomeIcon icon={faWarehouse} className="w-10 h-10 mb-3 opacity-30" />
                        <p>لا توجد منتجات</p>
                    </div>
                )}
            </div>

            <Pagination links={products.links} from={products.from} to={products.to} total={products.total} />
        </ShopLayout>
    );
}
