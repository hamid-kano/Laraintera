import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler, useEffect } from 'react';
import InputField from '@/Components/UI/InputField';
import useUIStore from '@/store/uiStore';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { lang } = useUIStore();
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    useEffect(() => {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title={t('forgotPassword.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </Link>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('forgotPassword.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('forgotPassword.desc')}</p>
                    </div>

                    <div className="px-8 py-6">
                        {status && (
                            <div className="mb-4 text-sm px-4 py-3 rounded-lg border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                                ✅ {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
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
                            <button type="submit" disabled={processing} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
                                {processing ? t('common.loading') : t('forgotPassword.submit')}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
                            <Link href={route('login')} className="font-medium" style={{ color: 'var(--color-primary)' }}>
                                ← {t('login.title')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
