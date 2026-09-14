import i18n from '@/i18n';

import { Tag } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export const tagOptions: ReadonlyArray<BoxSelectorOption<boolean>> = [
  {
    id: 'or-selector',
    value: true,
    label: i18n.t('edge.groups.tags.partialMatch'),
    description:
      i18n.t('edge.groups.tags.partialMatchDescription'),
    icon: Tag,
    iconType: 'badge',
  },
  {
    id: 'and-selector',
    value: false,
    label: i18n.t('edge.groups.tags.fullMatch'),
    description: i18n.t('edge.groups.tags.fullMatchDescription'),
    icon: Tag,
    iconType: 'badge',
  },
];
