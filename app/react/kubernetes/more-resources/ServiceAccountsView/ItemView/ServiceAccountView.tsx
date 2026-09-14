import { useCurrentStateAndParams } from '@uirouter/react';
import { Code, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, useCurrentTabIndex, Tab } from '@@/Widget/WidgetTabs';

import { ServiceAccountDetailsWidget } from './ServiceAccountDetailsWidget';
import { ServiceAccountYAMLEditor } from './ServiceAccountYAMLEditor';

export function ServiceAccountView() {
  const { t } = useTranslation();
  const {
    params: { namespace, name },
  } = useCurrentStateAndParams();

  const tabs: Tab[] = [
    {
      name: t('kubernetes.moreResources.serviceAccounts.details.tab'),
      icon: User,
      widget: <ServiceAccountDetailsWidget namespace={namespace} name={name} />,
      selectedTabParam: 'service-account',
    },
    {
      name: t('kubernetes.moreResources.resourceDetails.tabs.yaml'),
      icon: Code,
      widget: <ServiceAccountYAMLEditor />,
      selectedTabParam: 'YAML',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader
        title={t('kubernetes.moreResources.serviceAccounts.details.title')}
        breadcrumbs={[
          {
            label: t('kubernetes.moreResources.serviceAccounts.title'),
            link: 'kubernetes.moreResources.serviceAccounts',
          },
          {
            label: namespace,
            link: 'kubernetes.resourcePools.resourcePool',
            linkParams: { id: namespace },
          },
          name,
        ]}
        reload
      />
      <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
      {tabs[currentTabIndex].widget}
    </>
  );
}
