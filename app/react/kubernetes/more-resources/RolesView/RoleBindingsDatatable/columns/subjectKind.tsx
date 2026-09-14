import { columnHelper } from './helper';
import i18n from '@/i18n';

export const subjectKind = columnHelper.accessor(
  (row) => row.subjects?.map((sub) => sub.kind).join(', '),
  {
    header: () => i18n.t('kubernetes.moreResources.common.columns.subjectKind'),
    id: 'subjectKind',
    cell: ({ row }) =>
      row.original.subjects?.map((sub, index) => (
        <div key={index}>{sub.kind}</div>
      )) || '-',
  }
);
