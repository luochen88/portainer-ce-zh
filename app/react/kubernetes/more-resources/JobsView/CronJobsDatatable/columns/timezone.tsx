import { columnHelper } from './helper';
import i18n from '@/i18n';

export const timezone = columnHelper.accessor((row) => row.Timezone, {
  header: () => i18n.t('kubernetes.moreResources.cronJobs.columns.timezone'),
  id: 'timezone',
  cell: ({ getValue }) => getValue() ?? '',
});
