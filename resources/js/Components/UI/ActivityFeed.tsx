import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { cn } from '@/utils/cn';

interface Activity {
    text: string;
    time: string;
    icon?: IconDefinition;
}

interface Props {
    activities: Activity[];
    maxItems?: number;
    className?: string;
}

export default function ActivityFeed({ activities = [], maxItems = 5, className }: Props) {
    if (!activities.length) {
        return <div className="text-center py-6 text-[12px] text-(--color-text-muted)">لا توجد أنشطة</div>;
    }

    return (
        <div className={cn('flex flex-col gap-3 p-4', className)}>
            {activities.slice(0, maxItems).map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-(--color-surface-2) grid place-items-center shrink-0 text-(--color-primary)">
                        {activity.icon
                            ? <FontAwesomeIcon icon={activity.icon} className="w-3.5 h-3.5" />
                            : <span className="w-2 h-2 rounded-full bg-(--color-primary)" />
                        }
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-medium text-(--color-text-strong) leading-snug">{activity.text}</div>
                        <div className="text-[11px] text-(--color-text-muted) mt-0.5">{activity.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
