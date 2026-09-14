import { useCurrentStateAndParams } from '@uirouter/react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Code, Layers, History } from 'lucide-react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useNamespaceAccessRedirect } from '@/react/kubernetes/namespaces/hooks/useNamespaceAccessRedirect';

import { PageHeader } from '@@/PageHeader';
import { Tab, useCurrentTabIndex, WidgetTabs } from '@@/Widget/WidgetTabs';
import { Badge } from '@@/Badge';
import { Icon } from '@@/Icon';

import { useEventWarningsCount } from '../../queries/useEvents';
import { NamespaceYAMLEditor } from '../components/NamespaceYamlEditor';
import { ResourceEventsDatatable } from '../../components/EventsDatatable/ResourceEventsDatatable';

import { UpdateNamespaceForm } from './UpdateNamespaceForm';
import { NamespaceAppsDatatable } from './NamespaceAppsDatatable';

export function NamespaceView() {
  const { t } = useTranslation();
  const stateAndParams = useCurrentStateAndParams();
  const {
    params: { id: namespace },
  } = stateAndParams;
  useNamespaceAccessRedirect(namespace, {
    to: 'kubernetes.resourcePools',
  });

  const environmentId = useEnvironmentId();
  const eventWarningCount = useEventWarningsCount(environmentId, { namespace });

  const tabs: Tab[] = [
    {
      name: t('kubernetes.namespaces.common.namespace'),
      icon: Layers,
      widget: <UpdateNamespaceForm />,
      selectedTabParam: 'namespace',
    },
    {
      name: (
        <div className="flex items-center gap-x-2">
          {t('kubernetes.namespaces.item.tabs.events')}
          {eventWarningCount >= 1 && (
            <Badge type="warnSecondary">
              <Icon icon={AlertTriangle} className="!mr-1" />
              {eventWarningCount}
            </Badge>
          )}
        </div>
      ),
      icon: History,
      widget: (
        <ResourceEventsDatatable
          namespace={namespace}
          storageKey="kubernetes.namespace.events"
          noWidget={false}
        />
      ),
      selectedTabParam: 'events',
    },
    {
      name: t('kubernetes.common.yaml'),
      icon: Code,
      widget: <NamespaceYAMLEditor />,
      selectedTabParam: 'YAML',
    },
  ];
  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader
        title={t('kubernetes.namespaces.item.title')}
        breadcrumbs={[
          { label: t('kubernetes.namespaces.list.breadcrumb'), link: 'kubernetes.resourcePools' },
          namespace,
        ]}
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        {tabs[currentTabIndex].widget}
        <NamespaceAppsDatatable namespace={namespace} />
      </>
    </>
  );
}
