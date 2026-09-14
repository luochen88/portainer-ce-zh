import { formatDate } from '@/portainer/filters/filters';
import i18n from '@/i18n';

import { columnHelper } from './helper';

export const started = columnHelper.accessor(
  (row) => formatDate(row.StartTime),
  {
    header: () => i18n.t('kubernetes.moreResources.jobs.columns.started'),
    id: 'started',
    cell: ({ getValue }) => getValue() ?? '',
  }
);
