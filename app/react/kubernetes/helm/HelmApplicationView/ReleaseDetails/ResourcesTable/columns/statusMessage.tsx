import { columnHelper } from './helper';
import i18n from '@/i18n';

export const statusMessage = columnHelper.accessor((row) => row.statusMessage, {
  header: () => i18n.t('kubernetes.common.columns.statusMessage'),
  id: 'statusMessage',
  cell: ({ row }) => (
    <div className="whitespace-pre-wrap">
      <span>{row.original.statusMessage || '-'}</span>
    </div>
  ),
});
