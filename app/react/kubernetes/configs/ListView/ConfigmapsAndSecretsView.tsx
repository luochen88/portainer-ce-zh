import { FileCode, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { Tab, WidgetTabs, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { ConfigMapsDatatable } from './ConfigMapsDatatable';
import { SecretsDatatable } from './SecretsDatatable';


export function ConfigmapsAndSecretsView() {
  const { t } = useTranslation();
  const tabs: Tab[] = [
    {
      name: t('kubernetes.configs.configMaps.title'),
      icon: FileCode,
      widget: <ConfigMapsDatatable />,
      selectedTabParam: 'configmaps',
    },
    {
      name: t('kubernetes.configs.secrets.title'),
      icon: Lock,
      widget: <SecretsDatatable />,
      selectedTabParam: 'secrets',
    },
  ];
  const currentTabIndex = useCurrentTabIndex(tabs);
  return (
    <>
      <PageHeader
        title={t('kubernetes.configs.list.title')}
        breadcrumbs={t('kubernetes.configs.list.breadcrumb')}
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
