import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGauge, faShoppingBag, faCartShopping, faBoxOpen,
    faUser, faAnglesLeft, faRightFromBracket, faCode, faShield, faWarehouse,
} from '@fortawesome/free-solid-svg-icons';
import useUIStore from '@/store/uiStore';

const useNavItems = (t: (k: string) => string, isAdmin: boolean) => [
    {
        group: t('nav.dashboard'),
        items: [
            { routeName: 'dashboard',    icon: faGauge,  label: t('nav.dashboard') },
            { routeName: 'api.explorer', icon: faCode,   label: 'API Explorer' },
            ...(isAdmin ? [
                { routeName: 'admin.dashboard', icon: faShield,    label: 'Admin' },
                { routeName: 'inventory.index', icon: faWarehouse, label: 'المخزون' },
            ] : []),
        ],
    },
    {
        group: t('nav.products'),
        items: [
            { routeName: 'products.index', icon: faShoppingBag,   label: t('nav.products') },
            { routeName: 'cart.index',     icon: faCartShopping,  label: t('nav.cart'),   badge: true },
            { routeName: 'orders.index',   icon: faBoxOpen,       label: t('nav.orders') },
        ],
    },
    {
        group: t('nav.profile'),
        items: [
            { routeName: 'profile.edit',   icon: faUser,          label: t('nav.profile') },
        ],
    },
];

export default function Sidebar() {
    const { t } = useTranslation();
    const { sidebarCollapsed, sidebarMobileOpen, lang, toggleSidebar, closeMobileSidebar } = useUIStore();
    const { cartCount } = usePage().props as any;
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.roles?.some((r: any) => r.name === 'admin') ?? false;
    const isRTL = lang === 'ar';
    const NAV = useNavItems(t, isAdmin);

    const collapseRotate = isRTL
        ? (sidebarCollapsed ? '' : 'rotate-180')
        : (sidebarCollapsed ? 'rotate-180' : '');

    const mobileTranslate = sidebarMobileOpen
        ? 'translate-x-0'
        : isRTL ? 'max-md:translate-x-full' : 'max-md:-translate-x-full';

    const handleLogout = () => router.post(route('logout'));

    return (
        <>
            {sidebarMobileOpen && (
                <div className="fixed inset-0 z-[199] bg-black/50 backdrop-blur-sm md:hidden" onClick={closeMobileSidebar} />
            )}

            <aside className={[
                'fixed top-0 h-screen z-[200] flex flex-col overflow-hidden',
                'transition-all duration-200 ease-in-out bg-(--color-sidebar-bg)',
                isRTL ? 'right-0' : 'left-0',
                sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
                mobileTranslate,
            ].join(' ')}>

                {/* Logo */}
                <div className="flex items-center gap-3 px-[18px] min-h-16 border-b border-white/[0.06]">
                    <div className="w-9 h-9 rounded-[10px] bg-(--color-primary) grid place-items-center text-lg shrink-0 text-white font-bold">
                        ✦
                    </div>
                    <span className={`text-base font-bold text-white whitespace-nowrap transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        متجري
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2.5 py-3 overflow-y-auto overflow-x-hidden">
                    {NAV.map(({ group, items }) => (
                        <div key={group}>
                            <div className={`text-[10px] font-semibold tracking-widest uppercase text-(--color-sidebar-text) px-2.5 pt-4 pb-1.5 whitespace-nowrap transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                {group}
                            </div>
                            {items.map(({ routeName, icon, label, badge }) => {
                                const isActive = route().current(routeName);
                                const badgeCount = badge ? cartCount : null;
                                return (
                                    <Link
                                        key={routeName}
                                        href={route(routeName)}
                                        onClick={closeMobileSidebar}
                                        className={[
                                            'flex items-center gap-3 px-2.5 py-2.5 rounded-lg no-underline',
                                            'transition-colors duration-200 whitespace-nowrap',
                                            isActive
                                                ? 'bg-(--color-primary)/10 text-(--color-sidebar-active)'
                                                : 'text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white',
                                        ].join(' ')}
                                    >
                                        <FontAwesomeIcon icon={icon} className="w-4 h-4 shrink-0" />
                                        <span className={`text-[13.5px] font-medium transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                            {label}
                                        </span>
                                        {badgeCount > 0 && (
                                            <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} bg-(--color-primary) text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                                {badgeCount}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-2.5 py-3 border-t border-white/[0.06] flex flex-col gap-1">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4 shrink-0" />
                        <span className={`text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            {t('nav.logout')}
                        </span>
                    </button>

                    <button
                        onClick={toggleSidebar}
                        className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} className={`w-4 h-4 shrink-0 transition-transform duration-200 ${collapseRotate}`} />
                        <span className={`text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            {t('nav.collapse')}
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}
