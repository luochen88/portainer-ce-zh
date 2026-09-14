import { useTranslation } from 'react-i18next';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';

import { CreateNamespaceForm } from './CreateNamespaceForm';

export function CreateNamespaceView() {
  const { t } = useTranslation();
  const environmentId = useEnvironmentId();

  useUnauthorizedRedirect(
    {
      authorizations: 'K8sResourcePoolsW',
      adminOnlyCE: !isBE,
    },
    {
      to: 'kubernetes.resourcePools',
      params: {
        id: environmentId,
      },
    }
  );

  return (
    <div className="form-horizontal">
      <PageHeader
        title={t('kubernetes.namespaces.create.title')}
        breadcrumbs={[
          { label: t('kubernetes.namespaces.list.breadcrumb'), link: 'kubernetes.resourcePools' },
          t('kubernetes.namespaces.create.title'),
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <CreateNamespaceForm />
        </div>
      </div>
    </div>
  );
}
