import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => ReactNode;
}

interface Props<T> {
    title: string;
    subtitle?: string;
    columns: Column<T>[];
    data: T[];
    footer?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export default function DataTableCard<T extends Record<string, any>>({ title, subtitle, columns, data, footer, action, className }: Props<T>) {
    if (!data || data.length === 0) {
        return (
            <div className={cn('bg-(--color-surface) border border-(--color-border) rounded-xl shadow-sm overflow-hidden', className)}>
                <div className="px-4 py-3 border-b border-(--color-border)">
                    <h2 className="text-[14px] font-semibold text-(--color-text-strong)">{title}</h2>
                    {subtitle && <p className="text-[12px] text-(--color-text-muted) mt-1">{subtitle}</p>}
                </div>
                <div className="px-4 py-6 text-center text-[12px] text-(--color-text-muted)">لا توجد بيانات</div>
            </div>
        );
    }

    return (
        <div className={cn('bg-(--color-surface) border border-(--color-border) rounded-xl shadow-sm overflow-hidden', className)}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
                <div>
                    <h2 className="text-[14px] font-semibold text-(--color-text-strong)">{title}</h2>
                    {subtitle && <p className="text-[12px] text-(--color-text-muted) mt-1">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={String(col.key)} className="text-start px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted) border-b border-(--color-border)">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-(--color-surface-2) transition-colors">
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="px-4 py-3 text-[13px] text-(--color-text-strong) border-b border-(--color-border)">
                                        {col.render ? col.render(row[col.key as string], row) : (row[col.key as string] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {footer && (
                <div className="px-4 py-3 border-t border-(--color-border) bg-(--color-surface-2) text-[12px] text-(--color-text-muted)">
                    {footer}
                </div>
            )}
        </div>
    );
}
