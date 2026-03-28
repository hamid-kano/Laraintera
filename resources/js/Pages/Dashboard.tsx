import ShopLayout from '@/Layouts/ShopLayout';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { faShoppingBag, faBoxOpen, faDollarSign, faCartShopping, faPaperPlane, faUsers, faBriefcase, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import StatCard from '@/Components/UI/StatCard';
import PageHeader from '@/Components/UI/PageHeader';
import DataTableCard from '@/Components/UI/DataTableCard';
import ActivityFeed from '@/Components/UI/ActivityFeed';
import Badge from '@/Components/UI/Badge';

const STATUS_VARIANTS: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
    pending:    'warning',
    processing: 'info',
    completed:  'success',
    cancelled:  'danger',
};

const ACTIVITY = [
    { text: 'تم إضافة منتج جديد "iPhone 15 Pro"', time: 'منذ دقيقتين',  icon: faShoppingBag },
    { text: 'مستخدم جديد انضم للمنصة',             time: 'منذ 15 دقيقة', icon: faUsers },
    { text: 'تم إتمام طلب #12 بنجاح',              time: 'منذ ساعة',     icon: faBriefcase },
    { text: 'تقرير المبيعات لشهر مارس جاهز',        time: 'منذ 3 ساعات',  icon: faArrowTrendUp },
];

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        cartItems: number;
    };
    recentOrders: {
        id: number;
        status: string;
        total: number;
        created_at: string;
    }[];
}

export default function Dashboard({ stats, recentOrders }: DashboardProps) {
    const { t } = useTranslation();

    const STATS = [
        { icon: faShoppingBag,   color: 'bg-(--color-primary)/10 text-(--color-primary)', value: stats?.totalProducts ?? 0, labelKey: 'dashboard.totalProducts' },
        { icon: faBoxOpen,       color: 'bg-(--color-success)/10 text-(--color-success)', value: stats?.totalOrders   ?? 0, labelKey: 'dashboard.totalOrders' },
        { icon: faDollarSign,    color: 'bg-(--color-warning)/10 text-(--color-warning)', value: `$${stats?.totalRevenue ?? 0}`, labelKey: 'dashboard.totalRevenue' },
        { icon: faCartShopping,  color: 'bg-(--color-info)/10    text-(--color-info)',    value: stats?.cartItems     ?? 0, labelKey: 'dashboard.cartItems' },
    ];

    const columns = [
        { key: 'id',         label: t('dashboard.colOrder'),  render: (v: number) => `#${v}` },
        { key: 'status',     label: t('dashboard.colStatus'), render: (v: string) => <Badge variant={STATUS_VARIANTS[v] || 'default'} dot>{t(`status.${v}`)}</Badge> },
        { key: 'total',      label: t('dashboard.colTotal'),  render: (v: number) => `$${v}` },
        { key: 'created_at', label: t('dashboard.colDate'),   render: (v: string) => new Date(v).toLocaleDateString('ar-SA') },
    ];

    return (
        <ShopLayout>
            <Head title={t('dashboard.title')} />

            <PageHeader
                breadcrumbs={[{ label: t('nav.dashboard') }]}
                title={t('dashboard.title')}
                subtitle={t('dashboard.subtitle')}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {STATS.map((s) => (
                    <StatCard key={s.labelKey} icon={s.icon} label={t(s.labelKey)} value={s.value} color={s.color} />
                ))}
            </div>

            {/* Table + Activity */}
            <div className="grid grid-cols-1 min-[1024px]:grid-cols-2 gap-4">
                <DataTableCard
                    title={t('dashboard.recentOrders')}
                    columns={columns}
                    data={recentOrders ?? []}
                    footer={`${recentOrders?.length ?? 0} ${t('nav.orders')}`}
                />

                <div className="bg-(--color-surface) border border-(--color-border) rounded-xl shadow-sm">
                    <div className="px-4 py-3 border-b border-(--color-border)">
                        <h2 className="text-[14px] font-semibold text-(--color-text-strong)">{t('dashboard.activity')}</h2>
                    </div>
                    <ActivityFeed activities={ACTIVITY} />
                </div>
            </div>
        </ShopLayout>
    );
}
