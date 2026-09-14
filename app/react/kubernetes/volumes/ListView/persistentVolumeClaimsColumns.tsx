import { createColumnHelper } from '@tanstack/react-table';
import { slugify } from 'markdown-to-jsx';
import { Edit } from 'lucide-react';

import { formatDate } from '@/portainer/filters/filters';
import i18n from '@/i18n';

import { StatusBadge, StatusBadgeType } from '@@/StatusBadge';
import { Link } from '@@/Link';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

import { PersistentVolumeClaim, PersistentVolumeClaimPhase } from './types';

const helper = createColumnHelper<PersistentVolumeClaim>();

export function createPersistentVolumeClaimsColumns(
  onEditResizeClaim: (claim: PersistentVolumeClaim) => void
) {
  return [
    helper.accessor('name', {
      header: i18n.t('kubernetes.common.columns.name'),
      cell: ({ row: { original } }) => {
        return original.namespace && original.name ? (
          <Link
            to="kubernetes.volumes.volume"
            params={{
              namespace: original.namespace,
              name: original.name,
            }}
            data-cy={`volume-link-${original.name}`}
          >
            {original.name}
          </Link>
        ) : (
          <>{original.name}</>
        );
      },
    }),
    helper.accessor('namespace', {
      header: i18n.t('kubernetes.common.columns.namespace'),
    }),
    helper.accessor('owningApplications', {
      header: i18n.t('kubernetes.common.columns.usedBy'),
      id: 'owningApplications',
      cell: ({ getValue }) => {
        const apps = getValue();
        if (!apps?.length) {
          return '-';
        }
        return (
          <div className="flex flex-col gap-y-1">
            {apps.map((app) => (
              <Link
                key={app.Uid ?? app.Name}
                to="kubernetes.applications.application"
                params={{
                  name: app.Name,
                  namespace: app.ResourcePool,
                  'resource-type': app.ApplicationType,
                }}
                data-cy={`pvc-owning-app-${app.Name}`}
              >
                {app.Name}
              </Link>
            ))}
          </div>
        );
      },
    }),
    helper.accessor('phase', {
      header: i18n.t('kubernetes.common.columns.status'),
      cell: ({ getValue }) => {
        const phase = getValue();
        return <StatusBadge color={phaseColor(phase)}>{phase}</StatusBadge>;
      },
    }),
    helper.accessor('storageRequest', {
      header: i18n.t('kubernetes.volumes.columns.capacity'),
    }),
    helper.accessor((row) => row.humanReadableAccessModes.join(', '), {
      header: i18n.t('kubernetes.volumes.columns.accessModes'),
      id: 'accessModes',
    }),
    helper.accessor('storageClass', {
      header: i18n.t('kubernetes.volumes.columns.storageClass'),
    }),
    helper.accessor('volumeName', {
      header: i18n.t('kubernetes.volumes.columns.volume'),
    }),
    helper.accessor((row) => formatDate(row.creationDate), {
      header: i18n.t('kubernetes.common.columns.created'),
      id: 'created',
    }),
    helper.display({
      id: 'actions',
      header: i18n.t('kubernetes.common.columns.actions'),
      cell: ({ row: { original } }) => {
        const isExpandable = original.allowVolumeExpansion;
        return (
          <TooltipWithChildren
            message={
              isExpandable
                ? i18n.t('kubernetes.volumes.claims.resize.tooltip')
                : i18n.t('kubernetes.volumes.claims.resize.notAllowed')
            }
            position="top"
          >
            <Button
              color="light"
              className="!ml-0"
              disabled={!isExpandable}
              data-cy={`kubernetes-pv-resize-edit-${slugify(original.name)}`}
              onClick={() => onEditResizeClaim(original)}
            >
              <Icon icon={Edit} />
            </Button>
          </TooltipWithChildren>
        );
      },
    }),
  ];
}

function phaseColor(phase: PersistentVolumeClaimPhase): StatusBadgeType {
  switch (phase) {
    case 'Bound':
      return 'successLite';
    case 'Pending':
      return 'warningLite';
    case 'Lost':
      return 'dangerLite';
    default:
      return 'mutedLite';
  }
}
