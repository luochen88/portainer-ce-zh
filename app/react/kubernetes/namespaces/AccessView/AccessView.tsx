import { useCurrentStateAndParams } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';

import { NamespaceDetailsWidget } from './NamespaceDetailsWidget';
import { AccessDatatable } from './AccessDatatable/AccessDatatable';
import { CreateAccessWidget } from './CreateAccessWidget/CreateAccessWidget';

export function AccessView() {
  const { t } = useTranslation();
  const {
    params: { id: namespaceName },
  } = useCurrentStateAndParams();
  useUnauthorizedRedirect(
    { authorizations: ['K8sResourcePoolDetailsW'] },
    { to: 'kubernetes.resourcePools' }
  );
  return (
    <>
      <PageHeader
        title={t('kubernetes.namespaces.access.title')}
        breadcrumbs={[
          { label: t('kubernetes.namespaces.list.breadcrumb'), link: 'kubernetes.resourcePools' },
          {
            label: namespaceName,
            link: 'kubernetes.resourcePools.resourcePool',
            linkParams: { id: namespaceName },
          },
          t('kubernetes.namespaces.access.breadcrumb'),
        ]}
        reload
      />
      <NamespaceDetailsWidget />
      <CreateAccessWidget />
      <AccessDatatable />
    </>
  );
}
