import { columnHelper } from './helper';
import i18n from '@/i18n';

export const finished = columnHelper.accessor((row) => row.FinishTime, {
  header: () => i18n.t('kubernetes.moreResources.jobs.columns.finished'),
  id: 'finished',
  cell: ({ getValue }) => getValue() ?? '',
});
