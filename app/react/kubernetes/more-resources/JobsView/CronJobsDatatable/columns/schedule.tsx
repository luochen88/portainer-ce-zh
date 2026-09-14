import { columnHelper } from './helper';
import i18n from '@/i18n';

export const schedule = columnHelper.accessor((row) => row.Schedule, {
  header: () => i18n.t('kubernetes.moreResources.cronJobs.columns.schedule'),
  id: 'schedule',
  cell: ({ getValue }) => getValue() ?? '',
});
