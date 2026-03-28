import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler } from 'react';
import InputField from '@/Components/UI/InputField';
import { useApplySettings } from '@/hooks/useApplySettings';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { t } = useTranslation();
    useApplySettings();
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title={t('resetPassword.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </Link>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('resetPassword.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('resetPassword.desc')}</p>
                    </div>

                    <div className="px-8 py-6">
                        <form onSubmit={submit} className="space-y-4">
                            <InputField label={t('login.email')} icon={faEnvelope} type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />
                            <InputField label={t('register.password')} icon={faLock} type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} autoFocus />
                            <InputField label={t('register.confirmPassword')} icon={faLock} type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} error={errors.password_confirmation} />

                            <button type="submit" disabled={processing} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
                                {processing ? t('common.loading') : t('resetPassword.submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
