import { columnHelper } from './helper';
import i18n from '@/i18n';

export const suspend = columnHelper.accessor((row) => row.Suspend, {
  header: () => i18n.t('kubernetes.moreResources.cronJobs.columns.suspend'),
  id: 'suspend',
  cell: ({ getValue }) => {
    const suspended = getValue();
    return suspended ? 'Yes' : 'No';
  },
});
