import { columnHelper } from './helper';
import i18n from '@/i18n';

export const duration = columnHelper.accessor((row) => row.Duration, {
  header: () => i18n.t('kubernetes.moreResources.jobs.columns.duration'),
  id: 'duration',
  cell: ({ getValue }) => getValue() ?? '',
});
