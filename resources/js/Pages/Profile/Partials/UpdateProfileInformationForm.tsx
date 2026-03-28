import { Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string; className?: string }) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name:  user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-text-strong)' }}>{t('profile.infoTitle')}</h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t('profile.infoDesc')}</p>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('register.name')}</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full ps-9 pe-4 py-2.5 text-sm rounded-lg border outline-none transition-all"
                            style={{ background: 'var(--color-surface-2)', borderColor: errors.name ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('register.email')}</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full ps-9 pe-4 py-2.5 text-sm rounded-lg border outline-none transition-all"
                            style={{ background: 'var(--color-surface-2)', borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.email}</p>}
                </div>

                {/* Verify email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }}>
                        {t('profile.unverified')}{' '}
                        <Link href={route('verification.send')} method="post" as="button" className="underline font-medium">
                            {t('profile.resendVerification')}
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1 font-medium" style={{ color: 'var(--color-success)' }}>{t('profile.verificationSent')}</p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-opacity"
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
