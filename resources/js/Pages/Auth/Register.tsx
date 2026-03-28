import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler, useState } from 'react';
import useUIStore from '@/store/uiStore';
import { useApplySettings } from '@/hooks/useApplySettings';

export default function Register() {
    const { t } = useTranslation();
    useApplySettings();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const fields = [
        { key: 'name',     label: t('register.name'),            icon: faUser,     type: 'text',     placeholder: t('register.placeholder.name'),    show: null,          setShow: null },
        { key: 'email',    label: t('register.email'),           icon: faEnvelope, type: 'email',    placeholder: t('register.placeholder.email'),   show: null,          setShow: null },
        { key: 'password', label: t('register.password'),        icon: faLock,     type: 'password', placeholder: '••••••••',                         show: showPassword,  setShow: setShowPassword },
        { key: 'password_confirmation', label: t('register.confirmPassword'), icon: faLock, type: 'password', placeholder: '••••••••', show: showConfirm, setShow: setShowConfirm },
    ] as const;

    return (
        <>
            <Head title={t('register.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>

                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold" style={{ background: 'var(--color-primary)' }}>✦</div>
                            <span className="text-lg font-bold" style={{ color: 'var(--color-text-strong)' }}>متجري</span>
                        </Link>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('register.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('register.subtitle')}</p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-6">
                        <form onSubmit={submit} className="space-y-4">
                            {fields.map(({ key, label, icon, type, placeholder, show, setShow }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>
                                        {label}
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={icon} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type={setShow ? (show ? 'text' : 'password') : type}
                                            value={data[key]}
                                            onChange={(e) => setData(key, e.target.value)}
                                            placeholder={placeholder}
                                            className="w-full ps-9 pe-10 py-2.5 text-sm rounded-lg border outline-none transition-all"
                                            style={{ background: 'var(--color-surface-2)', borderColor: errors[key] ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                                        />
                                        {setShow && (
                                            <button type="button" onClick={() => setShow(!show)} className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineEnd: '12px', color: 'var(--color-text-muted)' }}>
                                                <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    {errors[key] && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors[key]}</p>}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60 mt-2"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                {processing ? t('common.loading') : t('register.submit')}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
                            {t('register.hasAccount')}{' '}
                            <Link href={route('login')} className="font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>
                                {t('register.loginLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
