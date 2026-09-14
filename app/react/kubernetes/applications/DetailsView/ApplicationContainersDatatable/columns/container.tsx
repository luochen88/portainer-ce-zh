import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { Trans, useTranslation } from 'react-i18next';
import { BarChart, FileText, Terminal } from 'lucide-react';

import { Authorized } from '@/react/hooks/useUser';
import { pluralize } from '@/react/common/string-utils';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip';
import { ExternalLink } from '@@/ExternalLink';
import { Link } from '@@/Link';
import { Icon } from '@@/Icon';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

import { ContainerRowData } from '../types';

const columnHelper = createColumnHelper<ContainerRowData>();

const name = columnHelper.accessor('name', {
  header: 'kubernetes.common.name',
  id: 'name',
  cell: ({ row: { original: container } }) => (
    <div className="flex justify-between gap-2">
      <span>{container.name}</span>
      <ContainerTypeBadge container={container} />
    </div>
  ),
});

function ContainerTypeBadge({ container }: { container: ContainerRowData }) {
  const { t } = useTranslation();
  if (container.isSidecar) {
    return (
      <Badge type="info">
        {t('kubernetes.applications.details.containers.badges.sidecar')}
        <Tooltip
          message={
            <>
              <ExternalLink
                to="https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/"
                data-cy="sidecar-link"
              >
                {t('kubernetes.applications.details.containers.badges.sidecarLink')}
              </ExternalLink>{' '}
              <Trans i18nKey="kubernetes.applications.details.containers.badges.sidecarDescription">
                run continuously alongside the main application, starting before
                other containers.
              </Trans>
            </>
          }
        />
      </Badge>
    );
  }

  if (container.isInit) {
    return (
      <Badge type="info">
        {t('kubernetes.applications.details.containers.badges.init')}
        <Tooltip
          message={
            <>
              <ExternalLink
                to="https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
                data-cy="init-link"
              >
                {t('kubernetes.applications.details.containers.badges.initLink')}
              </ExternalLink>{' '}
              <Trans i18nKey="kubernetes.applications.details.containers.badges.initDescription">
                run and complete before the main application containers start.
              </Trans>
            </>
          }
        />
      </Badge>
    );
  }

  return null;
}

const image = columnHelper.accessor('image', {
  header: 'kubernetes.common.image',
  cell: ({ getValue }) => (
    <div className="max-w-xs truncate" title={getValue()}>
      {getValue()}
    </div>
  ),
});

const imagePullPolicy = columnHelper.accessor('imagePullPolicy', {
  header: 'kubernetes.applications.details.containers.columns.imagePullPolicy',
  id: 'imagePullPolicy',
});

const status = columnHelper.accessor('status', {
  header: 'kubernetes.common.status',
  cell: StatusCell,
});

function StatusCell({
  getValue,
}: CellContext<ContainerRowData, ContainerRowData['status']>) {
  const statusData = getValue();

  return (
    <Badge type={statusData.type}>
      <div className="flex items-center gap-1">
        <span>
          {statusData.status}
          {statusData.restartCount &&
            ` (Restarted ${statusData.restartCount} ${pluralize(
              statusData.restartCount,
              'time'
            )})`}
        </span>
      </div>
      {statusData.message && <Tooltip message={statusData.message} />}
    </Badge>
  );
}

function buildActionsColumn(isServerMetricsEnabled: boolean, t: TFunction) {
  return columnHelper.accessor(() => '', {
    header: t('kubernetes.common.actions'),
    enableSorting: false,
    cell: ({ row: { original: container } }) => (
      <div className="flex gap-x-2">
        {container.status.status.includes('Running') &&
          isServerMetricsEnabled && (
            <Link
              className="flex items-center gap-1"
              to="kubernetes.applications.application.stats"
              params={{ pod: container.podName, container: container.name }}
              data-cy={`application-container-stats-${container.name}`}
            >
              <TooltipWithChildren message={t('kubernetes.applications.details.containers.actions.viewStatistics')} position="top">
                <Icon icon={BarChart} />
              </TooltipWithChildren>
            </Link>
          )}
        {container.status.hasLogs !== false && (
          <Link
            className="flex items-center gap-1"
            to="kubernetes.applications.application.logs"
            params={{ pod: container.podName, container: container.name }}
            data-cy={`application-container-logs-${container.name}`}
          >
            <TooltipWithChildren message={t('kubernetes.applications.details.containers.actions.viewLogs')} position="top">
              <Icon icon={FileText} />
            </TooltipWithChildren>
          </Link>
        )}
        {container.status.status.includes('Running') && (
          <Authorized authorizations="K8sApplicationConsoleRW">
            <Link
              className="flex items-center gap-1"
              to="kubernetes.applications.application.console"
              params={{ pod: container.podName, container: container.name }}
              data-cy={`application-container-console-${container.name}`}
            >
              <TooltipWithChildren message={t('kubernetes.applications.details.containers.actions.openConsole')} position="top">
                <Icon icon={Terminal} />
              </TooltipWithChildren>
            </Link>
          </Authorized>
        )}
      </div>
    ),
  });
}

export function getContainerColumns(
  isServerMetricsEnabled: boolean,
  t: TFunction
) {
  return [
    name,
    image,
    imagePullPolicy,
    status,
    buildActionsColumn(isServerMetricsEnabled, t),
  ];
}
