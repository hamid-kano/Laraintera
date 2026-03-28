import ShopLayout from '@/Layouts/ShopLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { faShoppingBag, faBoxOpen, faUsers, faDollarSign, faClock } from '@fortawesome/free-solid-svg-icons';
import StatCard from '@/Components/UI/StatCard';
import PageHeader from '@/Components/UI/PageHeader';
import DataTableCard from '@/Components/UI/DataTableCard';
import Badge from '@/Components/UI/Badge';

const STATUS_VARIANTS: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
    pending:    'warning',
    processing: 'info',
    completed:  'success',
    cancelled:  'danger',
};

const STATUS_LABELS: Record<string, string> = {
    pending:    'قيد الانتظار',
    processing: 'قيد المعالجة',
    completed:  'مكتمل',
    cancelled:  'ملغي',
};

interface Order {
    id: number; total: number; status: string;
    created_at: string;
    user: { name: string; email: string };
}

interface Stats {
    totalProducts: number; totalOrders: number;
    totalUsers: number; totalRevenue: number; pendingOrders: number;
}

export default function AdminDashboard({ stats, recentOrders }: { stats: Stats; recentOrders: Order[] }) {
    const { t } = useTranslation();
    const statusForm = useForm<{ status: string }>({ status: '' });

    const updateStatus = (orderId: number, status: string) => {
        statusForm.setData('status', status);
        statusForm.patch(route('admin.orders.status', orderId));
    };

    const STATS = [
        { icon: faShoppingBag, color: 'bg-(--color-primary)/10 text-(--color-primary)', value: stats.totalProducts, label: t('dashboard.totalProducts') },
        { icon: faBoxOpen,     color: 'bg-(--color-success)/10 text-(--color-success)', value: stats.totalOrders,   label: t('dashboard.totalOrders') },
        { icon: faUsers,       color: 'bg-(--color-info)/10    text-(--color-info)',    value: stats.totalUsers,    label: 'إجمالي المستخدمين' },
        { icon: faDollarSign,  color: 'bg-(--color-warning)/10 text-(--color-warning)', value: `$${stats.totalRevenue}`, label: t('dashboard.totalRevenue') },
        { icon: faClock,       color: 'bg-(--color-danger)/10  text-(--color-danger)',  value: stats.pendingOrders, label: 'طلبات معلقة' },
    ];

    const columns = [
        { key: 'id',         label: '#',          render: (v: number) => `#${v}` },
        { key: 'user',       label: 'العميل',      render: (_: any, row: Order) => row.user?.name },
        { key: 'total',      label: 'الإجمالي',    render: (v: number) => `$${v}` },
        { key: 'status',     label: 'الحالة',
            render: (v: string, row: Order) => (
                <select
                    value={v}
                    onChange={(e) => updateStatus(row.id, e.target.value)}
                    className="text-xs rounded-lg px-2 py-1 border outline-none"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }}
                >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            )
        },
        { key: 'created_at', label: 'التاريخ',     render: (v: string) => new Date(v).toLocaleDateString('ar-SA') },
    ];

    return (
        <ShopLayout>
            <Head title="لوحة تحكم الأدمن" />

            <PageHeader
                breadcrumbs={[{ label: 'الأدمن' }, { label: 'لوحة التحكم' }]}
                title="🛡️ لوحة تحكم الأدمن"
                subtitle="إدارة المتجر والطلبات والمنتجات"
                actions={
                    <div className="flex gap-2">
                        <Link href={route('admin.products')} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--color-primary)' }}>
                            إدارة المنتجات
                        </Link>
                        <Link href={route('admin.orders')} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                            إدارة الطلبات
                        </Link>
                    </div>
                }
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {STATS.map((s) => (
                    <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
                ))}
            </div>

            <DataTableCard
                title="أحدث الطلبات"
                columns={columns}
                data={recentOrders}
                footer={`${recentOrders.length} طلب`}
            />
        </ShopLayout>
    );
}
