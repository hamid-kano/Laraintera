import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Product {
    id: number; name: string; description: string;
    price: number; category: string; stock: number; image: string;
}

interface Props {
    products: Product[];
    categories: string[];
    filters: { search?: string; category?: string };
}

export default function Products({ products, categories, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('products.index'), { search: value, category: filters.category }, { preserveState: true, replace: true });
    };

    const handleCategory = (category: string) => {
        router.get(route('products.index'), { search: filters.search, category }, { preserveState: true, replace: true });
    };

    return (
        <ShopLayout>
            <Head title={t('products.title')} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('products.title')}</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('products.available', { count: products.length })}</p>
            </div>

            <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <input
                    type="text"
                    placeholder={t('products.searchPlaceholder')}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-sm outline-none transition-all flex-1 min-w-[200px]"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }}
                />
                <div className="flex gap-2 flex-wrap">
                    {['', ...categories].map((cat) => (
                        <button
                            key={cat || 'all'}
                            onClick={() => handleCategory(cat)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                            style={
                                (cat === '' ? !filters.category : filters.category === cat)
                                    ? { background: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
                                    : { background: 'var(--color-surface-2)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }
                            }
                        >
                            {cat || t('products.all')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                    <div key={product.id} className="rounded-xl border overflow-hidden transition-shadow hover:shadow-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
                        <div className="p-4">
                            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                                {product.category}
                            </span>
                            <h3 className="font-semibold mt-2 mb-1 text-sm" style={{ color: 'var(--color-text-strong)' }}>{product.name}</h3>
                            <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-text-muted)' }}>{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>${product.price}</span>
                                <Link href={route('products.show', product.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: 'var(--color-primary)' }}>
                                    {t('products.details')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20" style={{ color: 'var(--color-text-muted)' }}>
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-lg">{t('products.noResults')}</p>
                </div>
            )}
        </ShopLayout>
    );
}
