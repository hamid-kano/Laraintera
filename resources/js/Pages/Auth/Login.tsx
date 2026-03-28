import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEventHandler, useState } from 'react';
import InputField from '@/Components/UI/InputField';
import { useApplySettings } from '@/hooks/useApplySettings';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { t } = useTranslation();
    useApplySettings();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title={t('login.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </Link>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('login.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('login.subtitle')}</p>
                    </div>

                    <div className="px-8 py-6">
                        {status && (
                            <div className="mb-4 text-sm px-4 py-3 rounded-lg border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* 📌 errors.email تأتي من Laravel مترجمة تلقائياً حسب اللغة */}
                            <InputField
                                label={t('login.email')}
                                icon={faEnvelope}
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={t('login.placeholder.email')}
                                error={errors.email}
                                autoFocus
                            />

                            <div>
                                <InputField
                                    label={t('login.password')}
                                    icon={faLock}
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    error={errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute -mt-8 text-xs"
                                    style={{ insetInlineEnd: '2.5rem', color: 'var(--color-text-muted)' }}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked as false)}
                                        style={{ accentColor: 'var(--color-primary)' }}
                                    />
                                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{t('login.rememberMe')}</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-sm" style={{ color: 'var(--color-primary)' }}>
                                        {t('login.forgotPassword')}
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                {processing ? t('common.loading') : t('login.submit')}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
                            {t('login.noAccount')}{' '}
                            <Link href={route('register')} className="font-medium" style={{ color: 'var(--color-primary)' }}>
                                {t('login.registerLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
