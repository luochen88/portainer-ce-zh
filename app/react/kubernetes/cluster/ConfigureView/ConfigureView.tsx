import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { useTranslation } from 'react-i18next';
import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody } from '@@/Widget';

import { ConfigureForm } from './ConfigureForm';

export function ConfigureView() {
  const { data: environment } = useCurrentEnvironment();

  useUnauthorizedRedirect(
    {
      authorizations: 'K8sClusterW',
      adminOnlyCE: false,
    },
    {
      params: {
        id: environment?.Id,
      },
      to: 'kubernetes.dashboard',
    }
  );
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('kubernetes.cluster.configure.title')}
        breadcrumbs={[
          { label: t('kubernetes.common.breadcrumbs.environments'), link: 'portainer.endpoints' },
          {
            label: environment?.Name || '',
            link: 'portainer.endpoints.endpoint',
            linkParams: { id: environment?.Id },
          },
          t('kubernetes.cluster.configure.breadcrumb'),
        ]}
        reload
      />
      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetBody>
              <ConfigureForm />
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );
}
