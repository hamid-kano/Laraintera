import { create } from 'zustand';
import i18n from '../i18n';

interface UIStore {
    sidebarCollapsed: boolean;
    sidebarMobileOpen: boolean;
    theme: string;
    lang: string;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    closeMobileSidebar: () => void;
    toggleTheme: () => void;
    setLang: (lang: string) => void;
}

const applyLang = (lang: string) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
};

const useUIStore = create<UIStore>((set) => ({
    sidebarCollapsed:  false,
    sidebarMobileOpen: false,
    theme: localStorage.getItem('theme') || 'light',
    lang:  localStorage.getItem('lang')  || 'ar',

    toggleSidebar:      () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    toggleMobileSidebar:() => set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),
    closeMobileSidebar: () => set({ sidebarMobileOpen: false }),

    toggleTheme: () =>
        set((s) => {
            const next = s.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', next);
            document.documentElement.classList.toggle('dark', next === 'dark');
            return { theme: next };
        }),

    setLang: (lang) => {
        i18n.changeLanguage(lang);
        applyLang(lang);
        set({ lang });
    },
}));

export default useUIStore;
