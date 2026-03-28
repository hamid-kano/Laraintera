import { cn } from '@/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Card from './Card';

interface Props {
    icon: IconDefinition;
    label: string;
    value: string | number;
    color?: string;
    className?: string;
}

export default function StatCard({ icon, label, value, color, className }: Props) {
    return (
        <Card bodyClassName={cn('flex items-center gap-4 py-4', className)}>
            <div className={cn('w-10 h-10 rounded-xl grid place-items-center shrink-0', color)}>
                <FontAwesomeIcon icon={icon} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
                <div className="text-[11px] text-(--color-text-muted) uppercase tracking-wide truncate">{label}</div>
                <div className="text-[18px] font-bold text-(--color-text-strong) mt-0.5 truncate">{value}</div>
            </div>
        </Card>
    );
}
