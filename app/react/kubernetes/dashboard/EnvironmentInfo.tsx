import { Gauge } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { stripProtocol } from '@/react/common/string-utils';
import { useTagsForEnvironment } from '@/portainer/tags/queries';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useEnvironment } from '@/react/portainer/environments/queries';

import { Widget, WidgetTitle, WidgetBody } from '@@/Widget';

export function EnvironmentInfo() {
  const { t } = useTranslation();
  const environmentId = useEnvironmentId();
  const { data: environmentData, ...environmentQuery } =
    useEnvironment(environmentId);
  const tagsQuery = useTagsForEnvironment(environmentId);
  const tagNames = tagsQuery.tags?.map((tag) => tag.Name).join(', ') || '-';

  return (
    <Widget>
      <WidgetTitle icon={Gauge} title={t('kubernetes.dashboard.environmentInfo.title')} />
      <WidgetBody loading={environmentQuery.isLoading}>
        {environmentQuery.isError && <div>{t('kubernetes.dashboard.environmentInfo.error')}</div>}
        {environmentData && (
          <table className="table">
            <tbody>
              <tr>
                <td className="!border-none">{t('kubernetes.dashboard.environmentInfo.environment')}</td>
                <td
                  className="!border-none"
                  data-cy="dashboard-environmentName"
                >
                  {environmentData.Name}
                </td>
              </tr>
              <tr>
                <td className="!border-t">{t('kubernetes.dashboard.environmentInfo.url')}</td>
                <td className="!border-t" data-cy="dashboard-environmenturl">
                  {stripProtocol(environmentData.URL) || '-'}
                </td>
              </tr>
              <tr>
                <td>{t('kubernetes.dashboard.environmentInfo.tags')}</td>
                <td data-cy="dashboard-environmentTags">{tagNames}</td>
              </tr>
            </tbody>
          </table>
        )}
      </WidgetBody>
    </Widget>
  );
}
