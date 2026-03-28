import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars, faMagnifyingGlass, faMoon, faSun,
    faBell, faUser, faGear, faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import useUIStore from '@/store/uiStore';

export default function Navbar() {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const { lang, theme, toggleMobileSidebar, toggleTheme, setLang } = useUIStore();
    const isRTL = lang === 'ar';

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initials = auth?.user?.name
        ? auth.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const menuItems = [
        { type: 'label', label: auth?.user?.email ?? '' },
        { type: 'divider' },
        { label: t('navbar.profile'),  icon: faUser,              onClick: () => router.visit(route('profile.edit')) },
        { label: t('navbar.settings'), icon: faGear,              onClick: () => router.visit(route('profile.edit')) },
        { type: 'divider' },
        { label: t('navbar.logout'),   icon: faRightFromBracket,  onClick: () => router.post(route('logout')), danger: true },
    ];

    return (
        <header className="sticky top-0 z-[100] h-16 flex items-center px-4 gap-2 w-full bg-(--color-surface) border-b border-(--color-border) shadow-sm">

            {/* Mobile menu toggle */}
            <button
                onClick={toggleMobileSidebar}
                className="md:hidden grid place-items-center w-9 h-9 rounded-lg text-(--color-text) hover:bg-(--color-surface-2) transition-colors shrink-0"
            >
                <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-[360px] hidden md:block">
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none w-3.5 h-3.5"
                    style={{ insetInlineStart: '12px' }}
                />
                <input
                    type="search"
                    placeholder={t('navbar.search')}
                    className="w-full py-2 ps-9 pe-4 text-[13px] rounded-lg border border-(--color-border) bg-(--color-surface-2) text-(--color-text-strong) placeholder:text-(--color-text-muted) outline-none focus:border-(--color-primary) transition-all"
                />
            </div>

            <div className="flex items-center gap-1.5 ms-auto">

                {/* Lang toggle */}
                <button
                    onClick={() => setLang(isRTL ? 'en' : 'ar')}
                    className="h-8 px-2.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-text) text-[11px] font-bold hover:bg-(--color-surface-2) transition-colors"
                >
                    {isRTL ? 'EN' : 'ع'}
                </button>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 rounded-lg border border-(--color-border) bg-(--color-surface) grid place-items-center text-(--color-text) hover:bg-(--color-surface-2) transition-colors"
                >
                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-3.5 h-3.5" />
                </button>

                {/* Notifications */}
                <button className="relative w-8 h-8 rounded-lg border border-(--color-border) bg-(--color-surface) grid place-items-center text-(--color-text) hover:bg-(--color-surface-2) transition-colors">
                    <FontAwesomeIcon icon={faBell} className="w-3.5 h-3.5" />
                    <span className="absolute top-1 end-1 w-2 h-2 bg-(--color-danger) rounded-full border-2 border-(--color-surface)" />
                </button>

                <div className="w-px h-6 bg-(--color-border) mx-0.5" />

                {/* User Dropdown */}
                <div ref={menuRef} className="relative inline-block">
                    <div
                        onClick={() => setMenuOpen((o) => !o)}
                        className="flex items-center gap-2 ps-1 pe-2 py-1 rounded-xl border border-(--color-border) bg-(--color-surface) cursor-pointer hover:bg-(--color-surface-2) transition-colors"
                    >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-(--color-primary) to-(--color-secondary) grid place-items-center text-white text-[11px] font-bold shrink-0">
                            {initials}
                        </div>
                        <div className="leading-tight hidden md:block">
                            <div className="text-[13px] font-semibold text-(--color-text-strong)">{auth?.user?.name || 'مستخدم'}</div>
                            <div className="text-[11px] text-(--color-text-muted)">عميل</div>
                        </div>
                    </div>

                    {menuOpen && (
                        <div className={cn(
                            'absolute top-full mt-1.5 z-[300] min-w-[180px]',
                            'bg-(--color-surface) border border-(--color-border)',
                            'rounded-xl shadow-lg py-1.5',
                            'animate-[modalIn_0.15s_ease]',
                            'end-0',
                        )}>
                            {menuItems.map((item, i) => {
                                if (item.type === 'divider') return <div key={i} className="my-1 border-t border-(--color-border)" />;
                                if (item.type === 'label') return (
                                    <p key={i} className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted) truncate">
                                        {item.label}
                                    </p>
                                );
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { item.onClick?.(); setMenuOpen(false); }}
                                        className={cn(
                                            'w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-start transition-colors hover:bg-(--color-surface-2)',
                                            item.danger ? 'text-(--color-danger)' : 'text-(--color-text-strong)',
                                        )}
                                    >
                                        {item.icon && <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
