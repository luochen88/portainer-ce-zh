import { Database, HardDrive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { PersistentVolumesDatatable } from './PersistentVolumesDatatable';
import { StorageClassesDatatable } from './StorageClassesDatatable';
import { PersistentVolumeClaimsDatatable } from './PersistentVolumeClaimsDatatable';

export function VolumesView() {
  const { t } = useTranslation();
  const tabs: Tab[] = [
    {
      name: t('kubernetes.volumes.tabs.persistentVolumeClaims'),
      icon: Database,
      widget: <PersistentVolumeClaimsDatatable />,
      selectedTabParam: 'volume-claims',
    },
    {
      name: t('kubernetes.volumes.tabs.persistentVolumes'),
      icon: Database,
      widget: <PersistentVolumesDatatable />,
      selectedTabParam: 'volumes',
    },
    {
      name: t('kubernetes.volumes.tabs.storageClasses'),
      icon: HardDrive,
      widget: <StorageClassesDatatable />,
      selectedTabParam: 'storage',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader title={t('kubernetes.volumes.list.title')} breadcrumbs={t('kubernetes.volumes.list.breadcrumb')} reload />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
