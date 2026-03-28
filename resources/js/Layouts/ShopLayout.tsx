import Sidebar from '@/Components/Shop/Sidebar';
import Navbar from '@/Components/Shop/Navbar';
import { PropsWithChildren, useState } from 'react';

export default function ShopLayout({ children }: PropsWithChildren) {
    const [collapsed, setCollapsed] = useState(false);
    const offset = collapsed ? 'md:mr-[68px]' : 'md:mr-[260px]';

    return (
        <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`flex flex-col min-h-screen transition-all duration-200 ${offset}`}>
                <Navbar />
                <main className="flex-1 p-4 md:p-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
