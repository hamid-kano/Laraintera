import { Link, usePage } from '@inertiajs/react';

const NAV = [
    {
        group: 'المتجر',
        items: [
            { href: 'products.index', label: 'المنتجات',    icon: '🛍️' },
            { href: 'cart.index',     label: 'السلة',        icon: '🛒', badge: true },
            { href: 'orders.index',   label: 'الطلبات',      icon: '📦' },
        ],
    },
    {
        group: 'الحساب',
        items: [
            { href: 'dashboard',      label: 'لوحة التحكم',  icon: '📊' },
            { href: 'profile.edit',   label: 'الملف الشخصي', icon: '👤' },
        ],
    },
];

interface Props {
    collapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: Props) {
    const { cartCount } = usePage().props as any;

    return (
        <aside
            style={{ background: 'var(--color-sidebar-bg)' }}
            className={`fixed top-0 right-0 h-screen z-[200] flex flex-col transition-all duration-200 ${collapsed ? 'w-[68px]' : 'w-[260px]'}`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-[18px] min-h-16 border-b border-white/[0.06]">
                <div
                    className="w-9 h-9 rounded-[10px] grid place-items-center text-lg shrink-0 text-white font-bold"
                    style={{ background: 'var(--color-primary)' }}
                >
                    ✦
                </div>
                <span className={`text-base font-bold text-white whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    متجري
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2.5 py-3 overflow-y-auto overflow-x-hidden">
                {NAV.map(({ group, items }) => (
                    <div key={group}>
                        <div
                            className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 pt-4 pb-1.5 whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0' : 'opacity-100'}`}
                            style={{ color: 'var(--color-sidebar-text)' }}
                        >
                            {group}
                        </div>
                        {items.map(({ href, label, icon, badge }) => {
                            const isActive = route().current(href);
                            const badgeCount = badge ? cartCount : null;
                            return (
                                <Link
                                    key={href}
                                    href={route(href)}
                                    className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap"
                                    style={{
                                        color: isActive ? 'var(--color-sidebar-active)' : 'var(--color-sidebar-text)',
                                        background: isActive ? 'rgba(99,102,241,0.1)' : undefined,
                                    }}
                                >
                                    <span className="w-4 h-4 shrink-0 text-base leading-none">{icon}</span>
                                    <span className={`text-[13.5px] font-medium transition-opacity duration-200 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        {label}
                                    </span>
                                    {badgeCount > 0 && !collapsed && (
                                        <span
                                            className="mr-auto text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{ background: 'var(--color-primary)' }}
                                        >
                                            {badgeCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Toggle */}
            <div className="px-2.5 py-3 border-t border-white/[0.06]">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full transition-colors duration-200"
                    style={{ color: 'var(--color-sidebar-text)' }}
                >
                    <span className={`text-sm transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}>◀</span>
                    <span className={`text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        طي القائمة
                    </span>
                </button>
            </div>
        </aside>
    );
}
