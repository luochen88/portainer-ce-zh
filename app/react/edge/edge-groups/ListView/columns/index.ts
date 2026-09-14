import { columnHelper } from './helper';
import { name } from './name';

import i18n from '@/i18n';

export const columns = [
  name,
  columnHelper.accessor((group) => group.TrustedEndpoints.length, {
    header: i18n.t('edge.groups.columns.environmentsCount'),
  }),
  columnHelper.accessor('Dynamic', {
    header: i18n.t('edge.groups.columns.groupType'),
    cell: ({ getValue }) => (getValue() ? i18n.t('edge.groups.types.dynamic') : i18n.t('edge.groups.types.static')),
  }),
];
