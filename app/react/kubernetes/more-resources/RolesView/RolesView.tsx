import { UserCheck, Link } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { RolesDatatable } from './RolesDatatable';
import { RoleBindingsDatatable } from './RoleBindingsDatatable';

export function RolesView() {
  const { t } = useTranslation();
  useUnauthorizedRedirect(
    { authorizations: ['K8sRoleBindingsW', 'K8sRolesW'], adminOnlyCE: true },
    { to: 'kubernetes.dashboard' }
  );

  const tabs: Tab[] = [
    {
      name: t('kubernetes.moreResources.roles.tabs.roles'),
      icon: UserCheck,
      widget: <RolesDatatable />,
      selectedTabParam: 'roles',
    },
    {
      name: t('kubernetes.moreResources.roles.tabs.roleBindings'),
      icon: Link,
      widget: <RoleBindingsDatatable />,
      selectedTabParam: 'roleBindings',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader
        title={t('kubernetes.moreResources.roles.list.title')}
        breadcrumbs={t('kubernetes.moreResources.roles.title')}
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
