import { formatDate } from '@/portainer/filters/filters';
import i18n from '@/i18n';

import { columnHelper } from './helper';

export const created = columnHelper.accessor(
  (row) => formatDate(row.creationDate),
  {
    header: () => i18n.t('kubernetes.common.columns.created'),
    id: 'created',
    cell: ({ getValue }) => getValue(),
  }
);
