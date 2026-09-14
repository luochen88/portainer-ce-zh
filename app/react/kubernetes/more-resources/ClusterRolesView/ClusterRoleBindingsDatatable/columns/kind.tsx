import { columnHelper } from './helper';
import i18n from '@/i18n';

export const kind = columnHelper.accessor('roleRef.kind', {
  header: () => i18n.t('kubernetes.moreResources.common.columns.roleKind'),
  id: 'roleKind',
});
