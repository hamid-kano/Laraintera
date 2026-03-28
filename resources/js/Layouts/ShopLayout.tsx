import '@/i18n';
import Sidebar from '@/Components/Shop/Sidebar';
import Navbar from '@/Components/Shop/Navbar';
import { PropsWithChildren, useEffect } from 'react';
import useUIStore from '@/store/uiStore';

export default function ShopLayout({ children }: PropsWithChildren) {
    const { sidebarCollapsed, lang } = useUIStore();
    const isRTL = lang === 'ar';
    const offset = sidebarCollapsed
        ? (isRTL ? 'md:mr-[68px]'  : 'md:ml-[68px]')
        : (isRTL ? 'md:mr-[260px]' : 'md:ml-[260px]');

    // تطبيق dir و lang عند أول تحميل
    useEffect(() => {
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, []);

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
