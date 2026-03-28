import { Head, Link } from '@inertiajs/react';

const FEATURES = [
    { icon: '🛍️', title: 'تسوق سهل',       desc: 'تصفح آلاف المنتجات واشتر بنقرة واحدة' },
    { icon: '🚚', title: 'شحن مجاني',       desc: 'شحن مجاني على جميع الطلبات بدون حد أدنى' },
    { icon: '🔒', title: 'دفع آمن',         desc: 'جميع معاملاتك محمية بأعلى معايير الأمان' },
    { icon: '↩️', title: 'إرجاع مضمون',    desc: 'سياسة إرجاع مرنة خلال 30 يوماً' },
];

const PRODUCTS = [
    { name: 'iPhone 15 Pro',      price: 999,  category: 'إلكترونيات', image: 'https://placehold.co/300x300/6366f1/white?text=iPhone+15' },
    { name: 'Sony WH-1000XM5',    price: 349,  category: 'إلكترونيات', image: 'https://placehold.co/300x300/8b5cf6/white?text=Sony+WH' },
    { name: 'Nike Air Max 270',   price: 129,  category: 'أحذية',      image: 'https://placehold.co/300x300/f59e0b/white?text=Nike+Air' },
    { name: 'MacBook Pro M3',     price: 1999, category: 'إلكترونيات', image: 'https://placehold.co/300x300/10b981/white?text=MacBook' },
];

const STATS = [
    { value: '+500',  label: 'منتج متاح' },
    { value: '+10K',  label: 'عميل سعيد' },
    { value: '4.9★',  label: 'تقييم المتجر' },
    { value: '24/7',  label: 'دعم فني' },
];

interface Props {
    canLogin: boolean;
    canRegister: boolean;
}

export default function Welcome({ canLogin, canRegister }: Props) {
    return (
        <>
            <Head title="متجري — تسوق بذكاء" />

            <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

                {/* ── Navbar ── */}
                <header className="sticky top-0 z-50 border-b backdrop-blur-md bg-white/80" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg grid place-items-center text-white font-bold text-sm" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {canLogin && (
                                <Link href={route('login')} className="text-sm font-medium transition-colors" style={{ color: 'var(--color-text)' }}>
                                    تسجيل الدخول
                                </Link>
                            )}
                            {canRegister && (
                                <Link href={route('register')} className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors" style={{ background: 'var(--color-primary)' }}>
                                    ابدأ مجاناً
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Hero ── */}
                <section className="relative overflow-hidden py-24 px-4">
                    {/* خلفية ديكورية */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--color-primary)' }} />
                        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--color-secondary)' }} />
                    </div>

                    <div className="relative max-w-4xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                            ✨ أفضل تجربة تسوق إلكتروني
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6" style={{ color: 'var(--color-text-strong)' }}>
                            تسوّق بذكاء،
                            <br />
                            <span style={{ color: 'var(--color-primary)' }}>وفّر أكثر</span>
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--color-text)' }}>
                            اكتشف آلاف المنتجات بأفضل الأسعار. تسوق بأمان، استلم بسرعة، وارجع بسهولة.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href={route('register')} className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:opacity-90 shadow-lg" style={{ background: 'var(--color-primary)' }}>
                                ابدأ التسوق الآن ←
                            </Link>
                            <Link href={route('login')} className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl border transition-all hover:bg-black/5" style={{ color: 'var(--color-text-strong)', borderColor: 'var(--color-border)' }}>
                                لدي حساب بالفعل
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                    <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((s) => (
                            <div key={s.label} className="text-center">
                                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{s.value}</div>
                                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Features ── */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-strong)' }}>لماذا متجري؟</h2>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>نقدم لك تجربة تسوق لا مثيل لها</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="rounded-2xl border p-6 text-center transition-shadow hover:shadow-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <div className="text-4xl mb-4">{f.icon}</div>
                                    <h3 className="font-bold mb-2" style={{ color: 'var(--color-text-strong)' }}>{f.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Featured Products ── */}
                <section className="py-20 px-4" style={{ background: 'var(--color-surface)' }}>
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text-strong)' }}>منتجات مميزة</h2>
                                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>الأكثر مبيعاً هذا الأسبوع</p>
                            </div>
                            <Link href={route('login')} className="text-sm font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>
                                عرض الكل ←
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {PRODUCTS.map((p) => (
                                <div key={p.name} className="rounded-2xl border overflow-hidden transition-shadow hover:shadow-md group" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                                    <div className="overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="p-4">
                                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                                            {p.category}
                                        </span>
                                        <h3 className="font-semibold mt-2 mb-3 text-sm" style={{ color: 'var(--color-text-strong)' }}>{p.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold" style={{ color: 'var(--color-primary)' }}>${p.price}</span>
                                            <Link href={route('login')} className="text-xs font-medium text-white px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-primary)' }}>
                                                أضف للسلة
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-24 px-4 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at center, var(--color-primary), transparent 70%)` }} />
                    </div>
                    <div className="relative max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-strong)' }}>جاهز للبدء؟</h2>
                        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>انضم لآلاف العملاء الراضين وابدأ تسوقك اليوم</p>
                        <Link href={route('register')} className="inline-flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transition-all hover:opacity-90" style={{ background: 'var(--color-primary)' }}>
                            إنشاء حساب مجاني ←
                        </Link>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    © {new Date().getFullYear()} متجري — جميع الحقوق محفوظة
                </footer>

            </div>
        </>
    );
}
