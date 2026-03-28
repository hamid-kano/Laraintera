import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Navbar() {
    const { auth } = usePage().props as any;
    const [menuOpen, setMenuOpen] = useState(false);

    const initials = auth?.user?.name
        ? auth.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <header
            className="sticky top-0 z-[100] h-16 flex items-center px-4 gap-2 w-full border-b shadow-sm"
            style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
            }}
        >
            {/* Search */}
            <div className="relative flex-1 max-w-[360px] hidden md:block">
                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    🔍
                </span>
                <input
                    type="search"
                    placeholder="ابحث..."
                    className="w-full py-2 pr-9 pl-4 text-[13px] rounded-lg border outline-none transition-all"
                    style={{
                        background: 'var(--color-surface-2)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-strong)',
                    }}
                />
            </div>

            <div className="flex items-center gap-1.5 mr-auto">
                {/* Notifications */}
                <button
                    className="relative w-8 h-8 rounded-lg border grid place-items-center transition-colors"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                    🔔
                    <span
                        className="absolute top-1 left-1 w-2 h-2 rounded-full border-2"
                        style={{ background: 'var(--color-danger)', borderColor: 'var(--color-surface)' }}
                    />
                </button>

                <div className="w-px h-6 mx-0.5" style={{ background: 'var(--color-border)' }} />

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 ps-1 pe-2 py-1 rounded-xl border cursor-pointer transition-colors"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <div
                            className="w-7 h-7 rounded-lg grid place-items-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                        >
                            {initials}
                        </div>
                        <div className="leading-tight hidden md:block text-right">
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text-strong)' }}>
                                {auth?.user?.name || 'مستخدم'}
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>عميل</div>
                        </div>
                    </button>

                    {menuOpen && (
                        <div
                            className="absolute left-0 mt-2 w-48 rounded-xl border shadow-lg py-1 z-50"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            <div className="px-3 py-2 text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
                                {auth?.user?.email}
                            </div>
                            <div className="h-px my-1" style={{ background: 'var(--color-border)' }} />
                            <Link
                                href={route('profile.edit')}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-[13px] w-full transition-colors hover:bg-black/5"
                                style={{ color: 'var(--color-text-strong)' }}
                            >
                                👤 الملف الشخصي
                            </Link>
                            <div className="h-px my-1" style={{ background: 'var(--color-border)' }} />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 text-[13px] w-full transition-colors hover:bg-black/5"
                                style={{ color: 'var(--color-danger)' }}
                            >
                                🚪 تسجيل الخروج
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
