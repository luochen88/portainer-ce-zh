import { Row } from '@tanstack/react-table';
import i18n from '@/i18n';

import { Link } from '@@/Link';
import { filterHOC } from '@@/datatables/Filter';

import { ServiceAccount } from '../../types';

import { columnHelper } from './helper';

export const namespace = columnHelper.accessor('namespace', {
  header: () => i18n.t('kubernetes.common.columns.namespace'),
  id: 'namespace',
  cell: ({ row }) => (
    <Link
      to="kubernetes.resourcePools.resourcePool"
      params={{
        id: row.original.namespace,
      }}
      title={row.original.namespace}
      data-cy={`service-account-namespace-link-${row.original.name}`}
    >
      {row.original.namespace}
    </Link>
  ),
  meta: {
    filter: filterHOC(i18n.t('kubernetes.common.filters.namespace') as string),
  },
  enableColumnFilter: true,
  filterFn: (
    row: Row<ServiceAccount>,
    _columnId: string,
    filterValue: string[]
  ) =>
    filterValue.length === 0 ||
    filterValue.includes(row.original.namespace ?? ''),
});
