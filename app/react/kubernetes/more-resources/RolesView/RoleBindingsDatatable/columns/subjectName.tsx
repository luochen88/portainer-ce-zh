import { columnHelper } from './helper';
import i18n from '@/i18n';

export const subjectName = columnHelper.accessor(
  (row) => row.subjects?.map((sub) => sub.name).join(', '),
  {
    header: () => i18n.t('kubernetes.moreResources.common.columns.subjectName'),
    id: 'subjectName',
    cell: ({ row }) =>
      row.original.subjects?.map((sub, index) => (
        <div key={index}>{sub.name}</div>
      )) || '-',
  }
);
