import i18n from '@/i18n';

import { createColumnHelper } from '@tanstack/react-table';
import { truncate } from 'lodash';

import { Environment } from '@/react/portainer/environments/types';

export type DecoratedEnvironment = Environment & {
  Tags: string[];
  Group: string;
};

const columHelper = createColumnHelper<DecoratedEnvironment>();

export const columns = [
  columHelper.accessor('Name', {
    header: i18n.t('common.name'),
    id: 'Name',
    cell: ({ getValue }) => (
      <span title={getValue()}>{truncate(getValue(), { length: 64 })}</span>
    ),
  }),
  columHelper.accessor('Group', {
    header: i18n.t('common.group'),
    id: 'Group',
    cell: ({ getValue }) => (
      <span title={getValue()}>{truncate(getValue(), { length: 64 })}</span>
    ),
  }),
  columHelper.accessor((row) => row.Tags.join(','), {
    header: i18n.t('common.tags'),
    id: 'tags',
    enableSorting: false,
    cell: ({ getValue }) => (
      <span title={getValue()}>{truncate(getValue(), { length: 64 })}</span>
    ),
  }),
];
