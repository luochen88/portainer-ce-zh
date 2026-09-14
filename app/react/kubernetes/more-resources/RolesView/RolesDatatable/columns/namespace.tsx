import { Row } from '@tanstack/react-table';
import i18n from '@/i18n';

import { filterHOC } from '@@/datatables/Filter';
import { Link } from '@@/Link';

import { RoleRowData } from '../types';

import { columnHelper } from './helper';

export const namespace = columnHelper.accessor((row) => row.namespace, {
  header: () => i18n.t('kubernetes.common.columns.namespace'),
  id: 'namespace',
  cell: ({ getValue, row }) => (
    <Link
      to="kubernetes.resourcePools.resourcePool"
      params={{
        id: getValue(),
      }}
      title={getValue()}
      data-cy={`role-namespace-link-${row.original.name}`}
    >
      {getValue()}
    </Link>
  ),
  meta: {
    filter: filterHOC(i18n.t('kubernetes.common.filters.namespace') as string),
  },
  enableColumnFilter: true,
  filterFn: (row: Row<RoleRowData>, _columnId: string, filterValue: string[]) =>
    filterValue.length === 0 ||
    filterValue.includes(row.original.namespace ?? ''),
});
