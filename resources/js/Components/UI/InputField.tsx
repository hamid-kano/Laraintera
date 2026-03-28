import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: IconDefinition;
    error?: string;       // رسالة من Backend (مترجمة تلقائياً)
    hint?: string;        // تلميح اختياري من Frontend
}

export default function InputField({ label, icon, error, hint, ...props }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <FontAwesomeIcon
                        icon={icon}
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                        style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }}
                    />
                )}
                <input
                    {...props}
                    className="w-full py-2.5 text-sm rounded-lg border outline-none transition-all"
                    style={{
                        paddingInlineStart: icon ? '2.25rem' : '0.75rem',
                        paddingInlineEnd:   '0.75rem',
                        background:    'var(--color-surface-2)',
                        borderColor:   error ? 'var(--color-danger)' : 'var(--color-border)',
                        color:         'var(--color-text-strong)',
                    }}
                />
            </div>

            {/* رسالة الخطأ — تأتي من Backend مترجمة */}
            {error && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--color-danger)' }}>
                    ⚠ {error}
                </p>
            )}

            {/* تلميح — من Frontend */}
            {hint && !error && (
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {hint}
                </p>
            )}
        </div>
    );
}
