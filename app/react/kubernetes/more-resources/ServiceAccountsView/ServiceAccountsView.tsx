import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';

import { ServiceAccountsDatatable } from './ServiceAccountsDatatable';

export function ServiceAccountsView() {
  const { t } = useTranslation();
  useUnauthorizedRedirect(
    { authorizations: ['K8sServiceAccountsW'], adminOnlyCE: true },
    { to: 'kubernetes.dashboard' }
  );
  return (
    <>
      <PageHeader
        title={t('kubernetes.moreResources.serviceAccounts.list.title')}
        breadcrumbs={t('kubernetes.moreResources.serviceAccounts.title')}
        reload
      />
      <ServiceAccountsDatatable />
    </>
  );
}
