import { Row } from '@tanstack/react-table';
import i18n from '@/i18n';

import { filterHOC } from '@@/datatables/Filter';

import { ResourceRow } from '../types';

import { columnHelper } from './helper';

export const resourceType = columnHelper.accessor((row) => row.resourceType, {
  header: () => i18n.t('kubernetes.helm.resources.columns.resourceType'),
  id: 'resourceType',
  meta: {
    filter: filterHOC(i18n.t('kubernetes.helm.resources.filters.resourceType') as string),
  },
  enableColumnFilter: true,
  filterFn: (row: Row<ResourceRow>, _: string, filterValue: string[]) =>
    filterValue.length === 0 ||
    (!!row.original.resourceType &&
      filterValue.includes(row.original.resourceType)),
});
