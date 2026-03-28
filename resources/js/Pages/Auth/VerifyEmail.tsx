import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler } from 'react';
import { useApplySettings } from '@/hooks/useApplySettings';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    useApplySettings();
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title={t('verifyEmail.title')} />
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
                <div className="w-full max-w-md rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                    <div className="px-8 pt-8 pb-6 border-b text-center" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-4" style={{ background: 'var(--color-primary-light)' }}>
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{t('verifyEmail.title')}</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('verifyEmail.desc')}</p>
                    </div>

                    <div className="px-8 py-6">
                        {status === 'verification-link-sent' && (
                            <div className="mb-4 text-sm px-4 py-3 rounded-lg border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                                ✅ {t('verifyEmail.sent')}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <button type="submit" disabled={processing} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 mb-4" style={{ background: 'var(--color-primary)' }}>
                                {processing ? t('common.loading') : t('verifyEmail.resend')}
                            </button>
                        </form>

                        <div className="text-center">
                            <Link href={route('logout')} method="post" as="button" className="text-sm" style={{ color: 'var(--color-danger)' }}>
                                {t('nav.logout')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
