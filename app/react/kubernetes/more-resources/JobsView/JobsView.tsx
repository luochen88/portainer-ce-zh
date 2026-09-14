import { CalendarCheck2, CalendarSync } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUnauthorizedRedirect } from '@/react/hooks/useUnauthorizedRedirect';

import { PageHeader } from '@@/PageHeader';
import { WidgetTabs, Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';

import { JobsDatatable } from './JobsDatatable/JobsDatatable';
import { CronJobsDatatable } from './CronJobsDatatable/CronJobsDatatable';

export function JobsView() {
  const { t } = useTranslation();
  useUnauthorizedRedirect(
    { authorizations: ['K8sJobsR', 'K8sCronJobsR'] },
    { to: 'kubernetes.dashboard' }
  );

  const tabs: Tab[] = [
    {
      name: t('kubernetes.moreResources.jobs.tabs.cronJobs'),
      icon: CalendarSync,
      widget: <CronJobsDatatable />,
      selectedTabParam: 'cronJobs',
    },
    {
      name: t('kubernetes.moreResources.jobs.tabs.jobs'),
      icon: CalendarCheck2,
      widget: <JobsDatatable />,
      selectedTabParam: 'jobs',
    },
  ];

  const currentTabIndex = useCurrentTabIndex(tabs);

  return (
    <>
      <PageHeader
        title={t('kubernetes.moreResources.jobs.list.title')}
        breadcrumbs={t('kubernetes.moreResources.jobs.title')}
        reload
      />
      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        <div className="content">{tabs[currentTabIndex].widget}</div>
      </>
    </>
  );
}
