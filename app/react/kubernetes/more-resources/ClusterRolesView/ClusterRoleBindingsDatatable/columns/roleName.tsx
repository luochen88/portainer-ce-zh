import { columnHelper } from './helper';
import i18n from '@/i18n';

export const roleName = columnHelper.accessor('roleRef.name', {
  header: () => i18n.t('kubernetes.moreResources.common.columns.roleName'),
  id: 'roleName',
});
