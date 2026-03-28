import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler, useState, useEffect } from 'react';
import useUIStore from '@/store/uiStore';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { t } = useTranslation();
    const { lang } = useUIStore();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    useEffect(() => {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title={t('login.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>

                {/* Card */}
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </Link>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('login.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('login.subtitle')}</p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-6">
                        {status && (
                            <div className="mb-4 text-sm px-4 py-3 rounded-lg border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>
                                    {t('login.email')}
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t('login.placeholder.email')}
                                        autoFocus
                                        className="w-full ps-9 pe-4 py-2.5 text-sm rounded-lg border outline-none transition-all"
                                        style={{ background: 'var(--color-surface-2)', borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>
                                    {t('login.password')}
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faLock} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full ps-9 pe-10 py-2.5 text-sm rounded-lg border outline-none transition-all"
                                        style={{ background: 'var(--color-surface-2)', borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineEnd: '12px', color: 'var(--color-text-muted)' }}>
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password}</p>}
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked as false)}
                                        className="rounded"
                                        style={{ accentColor: 'var(--color-primary)' }}
                                    />
                                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{t('login.rememberMe')}</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-sm transition-colors" style={{ color: 'var(--color-primary)' }}>
                                        {t('login.forgotPassword')}
                                    </Link>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                {processing ? t('common.loading') : t('login.submit')}
                            </button>
                        </form>

                        {/* Register link */}
                        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
                            {t('login.noAccount')}{' '}
                            <Link href={route('register')} className="font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>
                                {t('login.registerLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
