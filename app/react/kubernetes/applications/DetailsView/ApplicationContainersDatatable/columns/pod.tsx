import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { Trash2 } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { formatDate } from '@/portainer/filters/filters';
import { pluralize } from '@/react/common/string-utils';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';
import { Link } from '@@/Link';
import { Icon } from '@@/Icon';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { LoadingButton } from '@@/buttons';
import { confirmDelete } from '@@/modals/confirm';

import { PodRowData } from '../types';

const columnHelper = createColumnHelper<PodRowData>();

const pod = columnHelper.accessor('podName', {
  header: 'kubernetes.common.pod',
  id: 'podName',
  cell: ({ row: { original: podRow } }) => {
    const statusData = podRow.status;
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate" title={podRow.podName}>
          {podRow.podName}
        </span>
        <Badge type={statusData.type}>
          <span>
            {statusData.status}
            {statusData.restartCount
              ? ` (Restarted ${statusData.restartCount} ${pluralize(
                  statusData.restartCount,
                  'time'
                )})`
              : ''}
          </span>
          {statusData.message && <Tooltip message={statusData.message} />}
        </Badge>
      </div>
    );
  },
});

const node = columnHelper.accessor('nodeName', {
  header: 'kubernetes.common.node',
  cell: ({ getValue }) => {
    const nodeName = getValue();
    return (
      <Authorized
        authorizations="K8sClusterNodeR"
        childrenUnauthorized={nodeName}
      >
        <Link
          to="kubernetes.cluster.node"
          params={{ nodeName }}
          data-cy={`application-container-node-${nodeName}`}
        >
          <div className="max-w-xs truncate" title={nodeName}>
            {nodeName}
          </div>
        </Link>
      </Authorized>
    );
  },
});

const podIp = columnHelper.accessor('podIp', {
  header: 'kubernetes.applications.details.containers.columns.podIp',
  id: 'podIp',
});

const containers = columnHelper.accessor(
  (row) => `${row.readyContainers}/${row.totalContainers}`,
  {
    id: 'containers',
    header: 'kubernetes.common.containers',
    enableSorting: false,
  }
);

const creationDate = columnHelper.accessor(
  (row) => formatDate(row.creationDate),
  {
    header: 'kubernetes.common.creationDate',
    cell: ({ getValue }) => getValue(),
  }
);

export const podColumns = [pod, node, podIp, containers, creationDate];

interface PodColumnsOptions {
  supportsRestartStrategy: boolean;
  onDelete: (podName: string) => void;
  isDeleting: boolean;
  isLoading: boolean;
  t: TFunction;
}

export function getPodColumns({
  supportsRestartStrategy,
  onDelete,
  isDeleting,
  isLoading,
  t,
}: PodColumnsOptions) {
  const deleteTooltip = supportsRestartStrategy
    ? t('kubernetes.applications.details.containers.actions.deleteRestartStrategyTooltip')
    : t('kubernetes.applications.details.containers.actions.deletePodTooltip');

  const actions = columnHelper.display({
    id: 'actions',
    header: t('kubernetes.common.actions'),
    cell: ({ row: { original: podRow } }) => (
      <Authorized authorizations="K8sApplicationsP">
        <div className="flex gap-x-2">
          <TooltipWithChildren message={deleteTooltip} position="top">
            <LoadingButton
              color="dangerlight"
              className="!ml-0"
              aria-label={t('kubernetes.applications.details.containers.actions.deletePodAria', { podName: podRow.podName })}
              isLoading={isLoading || isDeleting}
              loadingText={t('kubernetes.common.loading')}
              data-cy={`application-pod-delete-${podRow.podName}`}
              onClick={async () => {
                const confirmed = await confirmDelete(
                  t('kubernetes.applications.details.containers.actions.confirmDeletePod', { podName: podRow.podName })
                );
                if (!confirmed) {
                  return;
                }
                onDelete(podRow.podName);
              }}
            >
              <Icon icon={Trash2} />
            </LoadingButton>
          </TooltipWithChildren>
        </div>
      </Authorized>
    ),
  });

  return [pod, node, podIp, containers, creationDate, actions];
}
