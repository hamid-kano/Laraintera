import ShopLayout from '@/Layouts/ShopLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/Components/UI/PageHeader';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { t } = useTranslation();

    return (
        <ShopLayout>
            <Head title={t('nav.profile')} />

            <PageHeader
                breadcrumbs={[
                    { label: t('nav.dashboard'), href: route('dashboard') },
                    { label: t('nav.profile') },
                ]}
                title={t('nav.profile')}
                subtitle={t('profile.subtitle')}
            />

            <div className="max-w-3xl space-y-5">
                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </div>
        </ShopLayout>
    );
}
