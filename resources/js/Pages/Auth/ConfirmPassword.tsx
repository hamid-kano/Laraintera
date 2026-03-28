import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler, useEffect } from 'react';
import InputField from '@/Components/UI/InputField';
import useUIStore from '@/store/uiStore';

export default function ConfirmPassword() {
    const { t } = useTranslation();
    const { lang } = useUIStore();
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });

    useEffect(() => {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title={t('confirmPassword.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </Link>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('confirmPassword.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('confirmPassword.desc')}</p>
                    </div>

                    <div className="px-8 py-6">
                        <form onSubmit={submit} className="space-y-4">
                            <InputField
                                label={t('login.password')}
                                icon={faLock}
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                                autoFocus
                            />
                            <button type="submit" disabled={processing} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
                                {processing ? t('common.loading') : t('confirmPassword.submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
