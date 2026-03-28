import Sidebar from '@/Components/Shop/Sidebar';
import Navbar from '@/Components/Shop/Navbar';
import { PropsWithChildren, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import useUIStore from '@/store/uiStore';

export default function ShopLayout({ children }: PropsWithChildren) {
    const { sidebarCollapsed, lang, theme, setLang } = useUIStore();
    const { locale } = usePage().props as any;
    const isRTL = lang === 'ar';
    const offset = sidebarCollapsed
        ? (isRTL ? 'md:mr-[68px]'  : 'md:ml-[68px]')
        : (isRTL ? 'md:mr-[260px]' : 'md:ml-[260px]');

    useEffect(() => {
        // مزامنة اللغة مع Laravel Session
        if (locale && locale !== lang) setLang(locale);
    }, [locale]);

    // تطبيق dir/lang عند تغيير اللغة
    useEffect(() => {
        document.documentElement.setAttribute('dir',  isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }, [lang]);

    // تطبيق الثيم من Zustand store — ليس من localStorage
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <div className="min-h-screen bg-(--color-bg)">
            <Sidebar />
            <div className={`flex flex-col min-h-screen transition-all duration-200 ${offset}`}>
                <Navbar />
                <main className="flex-1 p-4 md:p-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
