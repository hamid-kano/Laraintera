import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const { t } = useTranslation();
    const passwordInput        = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) { reset('password', 'password_confirmation'); passwordInput.current?.focus(); }
                if (errs.current_password) { reset('current_password'); currentPasswordInput.current?.focus(); }
            },
        });
    };

    const fields = [
        { key: 'current_password',      label: t('profile.currentPassword'), ref: currentPasswordInput },
        { key: 'password',              label: t('profile.newPassword'),      ref: passwordInput },
        { key: 'password_confirmation', label: t('register.confirmPassword'), ref: undefined },
    ] as const;

    return (
        <div className={`rounded-xl border overflow-hidden ${className}`} style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-strong)' }}>{t('profile.passwordTitle')}</h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t('profile.passwordDesc')}</p>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
                {fields.map(({ key, label, ref }) => (
                    <div key={key}>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{label}</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                            <input
                                ref={ref}
                                type="password"
                                value={data[key]}
                                onChange={(e) => setData(key, e.target.value)}
                                className="w-full ps-9 pe-4 py-2.5 text-sm rounded-lg border outline-none transition-all"
                                style={{ background: 'var(--color-surface-2)', borderColor: errors[key] ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                            />
                        </div>
                        {errors[key] && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors[key]}</p>}
                    </div>
                ))}

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                        style={{ background: 'var(--color-primary)' }}
                    >
                        {processing ? t('common.loading') : t('common.save')}
                    </button>
                    {recentlySuccessful && (
                        <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-success)' }}>
                            <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
                            {t('profile.saved')}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
