import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const { t } = useTranslation();
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError:   () => passwordInput.current?.focus(),
            onFinish:  () => reset(),
        });
    };

    const closeModal = () => { setConfirming(false); clearErrors(); reset(); };

    return (
        <div className={`rounded-xl border overflow-hidden ${className}`} style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="text-[14px] font-semibold" style={{ color: 'var(--color-danger)' }}>{t('profile.deleteTitle')}</h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t('profile.deleteDesc')}</p>
            </div>

            <div className="p-6">
                <button
                    onClick={() => setConfirming(true)}
                    className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-danger)' }}
                >
                    {t('profile.deleteBtn')}
                </button>
            </div>

            {/* Modal */}
            {confirming && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="w-full max-w-md rounded-2xl border shadow-xl overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4" style={{ color: 'var(--color-danger)' }} />
                                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-strong)' }}>{t('profile.deleteConfirmTitle')}</h3>
                            </div>
                            <button onClick={closeModal} style={{ color: 'var(--color-text-muted)' }}>
                                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={deleteUser} className="p-6 space-y-4">
                            <p className="text-sm" style={{ color: 'var(--color-text)' }}>{t('profile.deleteConfirmDesc')}</p>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('login.password')}</label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faLock} className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                                    <input
                                        ref={passwordInput}
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        autoFocus
                                        className="w-full ps-9 pe-4 py-2.5 text-sm rounded-lg border outline-none"
                                        style={{ background: 'var(--color-surface-2)', borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text-strong)' }}
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ background: 'var(--color-danger)' }}>
                                    {processing ? t('common.loading') : t('profile.deleteBtn')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
