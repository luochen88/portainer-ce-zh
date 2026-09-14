import { useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';

import { queryKeys } from '../queries/query-keys';

import { EdgeStacksDatatable } from './EdgeStacksDatatable';

export function ListView() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return (
    <>
      <PageHeader
        title={t('edge.stacks.list.title')}
        breadcrumbs={t('edge.stacks.title')}
        reload
        onReload={() => queryClient.invalidateQueries(queryKeys.base())}
      />

      <EdgeStacksDatatable />
    </>
  );
}
