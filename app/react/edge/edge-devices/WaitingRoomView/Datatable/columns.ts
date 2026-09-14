import i18n from '@/i18n';

import moment from 'moment';
import { createColumnHelper } from '@tanstack/react-table';

import { WaitingRoomEnvironment } from '../types';

const columnHelper = createColumnHelper<WaitingRoomEnvironment>();

export const columns = [
  columnHelper.accessor('Name', {
    header: i18n.t('common.name'),
    id: 'Name',
  }),
  columnHelper.accessor('EdgeID', {
    header: i18n.t('edge.waitingRoom.columns.edgeId'),
    id: 'EdgeID',
  }),
  columnHelper.accessor((row) => row.EdgeGroups.join(', '), {
    header: i18n.t('edge.groups.title'),
    id: 'edge-groups',
    enableSorting: false,
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor((row) => row.Group, {
    header: i18n.t('common.group'),
    id: 'Group',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor((row) => row.Tags.join(', '), {
    header: i18n.t('common.tags'),
    id: 'tags',
    enableSorting: false,
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor((row) => row.LastCheckInDate, {
    header: i18n.t('edge.waitingRoom.columns.lastCheckIn'),
    id: 'LastCheckIn',
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? moment(value * 1000).fromNow() : '-';
    },
  }),
];
