import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

// 📌 مفهوم Inertia: Props تأتي مباشرة من Controller بدون API
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
}

interface Props {
    products: Product[];
    categories: string[];
    filters: { search?: string; category?: string };
}

export default function Products({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    // 📌 مفهوم Inertia: router.get() يرسل request لـ Laravel ويحدث الـ props بدون reload
    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('products.index'), { search: value, category: filters.category }, {
            preserveState: true,   // يحافظ على state المكون
            replace: true,         // لا يضيف للـ browser history
        });
    };

    const handleCategory = (category: string) => {
        router.get(route('products.index'), { search: filters.search, category }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <ShopLayout>
            <Head title="المنتجات" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">المنتجات</h1>
                <p className="text-gray-500">{products.length} منتج متاح</p>
            </div>

            {/* فلاتر البحث */}
            <div className="flex flex-wrap gap-4 mb-8">
                <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => handleCategory('')}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                        الكل
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${filters.category === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* شبكة المنتجات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">
                                {product.category}
                            </span>
                            <h3 className="font-semibold text-gray-900 mt-2 mb-1">{product.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-indigo-600">${product.price}</span>
                                {/* 📌 مفهوم Inertia: <Link> للتنقل لصفحة التفاصيل */}
                                <Link
                                    href={route('products.show', product.id)}
                                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    التفاصيل
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-lg">لا توجد منتجات مطابقة</p>
                </div>
            )}
        </ShopLayout>
    );
}
