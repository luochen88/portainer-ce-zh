import { columnHelper } from './helper';
import i18n from '@/i18n';

export const command = columnHelper.accessor((row) => row.Command, {
  header: () => i18n.t('kubernetes.common.columns.command'),
  id: 'command',
  cell: ({ getValue }) => getValue() ?? '',
});
