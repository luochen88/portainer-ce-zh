import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/react/components/PageHeader';
import { NodesDatatable } from '@/react/kubernetes/cluster/HomeView/NodesDatatable';

import { ClusterResourceReservation } from './ClusterResourceReservation';

export function ClusterView() {
  const { data: environment } = useCurrentEnvironment();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('kubernetes.cluster.title')}
        breadcrumbs={[
          { label: t('kubernetes.common.breadcrumbs.environments'), link: 'portainer.endpoints' },
          {
            label: environment?.Name || '',
            link: 'portainer.endpoints.endpoint',
            linkParams: { id: environment?.Id },
          },
          t('kubernetes.cluster.informationBreadcrumb'),
        ]}
        reload
      />

      <ClusterResourceReservation />

      <div className="row">
        <NodesDatatable />
      </div>
    </>
  );
}
