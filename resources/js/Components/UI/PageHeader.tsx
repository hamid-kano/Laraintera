import { Link } from '@inertiajs/react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BreadcrumbItem { label: string; href?: string; }

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function PageHeader({ breadcrumbs = [], title, subtitle, actions }: Props) {
    return (
        <div className="mb-5">
            {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 flex-wrap" aria-label="breadcrumb">
                    {breadcrumbs.map((item, i) => {
                        const isLast = i === breadcrumbs.length - 1;
                        return (
                            <div key={i} className="flex items-center gap-1.5">
                                {i > 0 && (
                                    <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 text-(--color-text-muted) rtl:rotate-180" />
                                )}
                                {isLast || !item.href ? (
                                    <span className={cn('text-[13px]', isLast ? 'text-(--color-text-strong) font-medium' : 'text-(--color-text-muted)')}>
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link href={item.href} className="text-[13px] text-(--color-text-muted) hover:text-(--color-primary) transition-colors">
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            )}
            <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-(--color-text-strong)">{title}</h1>
                    {subtitle && <p className="text-[13px] text-(--color-text-muted) mt-0.5">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
        </div>
    );
}
