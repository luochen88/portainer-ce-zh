import { createColumnHelper } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { slugify } from 'markdown-to-jsx';

import { formatDate } from '@/portainer/filters/filters';
import i18n from '@/i18n';

import { Badge } from '@@/Badge';
import { Link } from '@@/Link';
import { Button } from '@@/buttons';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Icon } from '@@/Icon';

import { StorageClass } from './types';

const helper = createColumnHelper<StorageClass>();

export function createStorageClassesColumns(
  onSetDefault: (storageClass: StorageClass) => void
) {
  return [
    helper.accessor('name', {
      header: i18n.t('kubernetes.common.columns.name'),
      cell: ({ row, getValue }) => {
        const name = getValue();
        return (
          <div className="flex items-center gap-2">
            <Link
              to="kubernetes.volumes.storageClass"
              params={{ name }}
              data-cy={`storage-class-name-link-${name}`}
            >
              {name}
            </Link>
            {row.original.isDefault && <Badge type="success">{i18n.t('kubernetes.common.default')}</Badge>}
          </div>
        );
      },
    }),
    helper.accessor('provisioner', {
      header: i18n.t('kubernetes.volumes.columns.provisioner'),
    }),
    helper.accessor('reclaimPolicy', {
      header: i18n.t('kubernetes.volumes.columns.reclaimPolicy'),
      cell: ({ getValue }) => getValue() ?? '-',
    }),
    helper.accessor('allowVolumeExpansion', {
      header: i18n.t('kubernetes.volumes.columns.volumeExpansion'),
      cell: ({ getValue }) => (getValue() ? i18n.t('kubernetes.common.allowed') : i18n.t('kubernetes.common.disallowed')),
    }),
    helper.accessor((row) => formatDate(row.creationDate), {
      header: i18n.t('kubernetes.common.columns.created'),
      id: 'created',
    }),
    helper.display({
      id: 'actions',
      header: i18n.t('kubernetes.common.columns.actions'),
      cell: ({ row: { original } }) => (
        <TooltipWithChildren
          message={
            original.isDefault
              ? i18n.t('kubernetes.volumes.storage.alreadyDefault')
              : i18n.t('kubernetes.volumes.storage.setDefault')
          }
          position="top"
        >
          <Button
            color="light"
            className="!ml-0"
            disabled={original.isDefault}
            data-cy={`k8s-storage-class-set-default-${slugify(original.name)}`}
            onClick={() => onSetDefault(original)}
          >
            <Icon icon={Star} />
          </Button>
        </TooltipWithChildren>
      ),
    }),
  ];
}
