import i18n from '@/i18n';

import { List, Tag } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export const groupTypeOptions: ReadonlyArray<BoxSelectorOption<boolean>> = [
  {
    id: 'static-group',
    value: false,
    label: i18n.t('edge.groups.types.static'),
    description: i18n.t('edge.groups.types.staticDescription'),
    icon: List,
    iconType: 'badge',
  },
  {
    id: 'dynamic-group',
    value: true,
    label: i18n.t('edge.groups.types.dynamic'),
    description: i18n.t('edge.groups.types.dynamicDescription'),
    icon: Tag,
    iconType: 'badge',
  },
] as const;
