import { Row } from '@tanstack/react-table';
import i18n from '@/i18n';

import { filterHOC } from '@@/datatables/Filter';
import { Link } from '@@/Link';

import { CronJob } from '../types';

import { columnHelper } from './helper';

export const namespace = columnHelper.accessor((row) => row.Namespace, {
  header: () => i18n.t('kubernetes.common.columns.namespace'),
  id: 'namespace',
  cell: ({ getValue, row }) => (
    <Link
      to="kubernetes.resourcePools.resourcePool"
      params={{
        id: getValue(),
      }}
      title={getValue()}
      data-cy={`cronJob-namespace-link-${row.original.Name}`}
    >
      {getValue()}
    </Link>
  ),
  meta: {
    filter: filterHOC(i18n.t('kubernetes.common.filters.namespace') as string),
  },
  enableColumnFilter: true,
  filterFn: (row: Row<CronJob>, _columnId: string, filterValue: string[]) =>
    filterValue.length === 0 ||
    filterValue.includes(row.original.Namespace ?? ''),
});
