import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Layers } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { humanize } from '@/portainer/filters/filters';

import { Button } from '@@/buttons';
import { Datatable } from '@@/datatables';
import { useTableStateWithoutStorage } from '@@/datatables/useTableState';
import { Modal } from '@@/modals';
import { ModalBody } from '@@/modals/Modal/ModalBody';

import { NodeRowData } from '../types';

import { columnHelper } from './helper';

interface CachedImageRow {
  id: string;
  image: string;
  aliases: string;
  aliasesCount: number;
  sizeBytes: number;
}

type NodeImage = NonNullable<
  NonNullable<NodeRowData['status']>['images']
>[number];

const imageColumnHelper = createColumnHelper<CachedImageRow>();

function getCachedImageColumns(t: TFunction) {
  return [
    imageColumnHelper.accessor('image', {
      id: 'image',
      header: t('kubernetes.cluster.nodes.cachedImages.columns.image'),
      meta: {
        width: '70%',
      },
      cell: ({ getValue }) => {
        const imageName = getValue();
        return (
          <span className="block truncate text-sm font-medium" title={imageName}>
            {imageName}
          </span>
        );
      },
    }),
    imageColumnHelper.accessor('aliases', {
      id: 'aliases',
      header: t('kubernetes.cluster.nodes.cachedImages.columns.aliases'),
      sortingFn: (left, right) =>
        left.original.aliasesCount - right.original.aliasesCount,
      meta: {
        width: '15%',
        className: 'whitespace-nowrap',
      },
      cell: ({ row }) => {
        const { aliasesCount } = row.original;
        return (
          <span className="text-muted text-sm">
            {t('kubernetes.cluster.nodes.cachedImages.aliasesCount', {
              count: aliasesCount,
            })}
          </span>
        );
      },
    }),
    imageColumnHelper.accessor('sizeBytes', {
      id: 'sizeBytes',
      header: t('kubernetes.cluster.nodes.cachedImages.columns.size'),
      sortingFn: 'alphanumeric',
      meta: {
        width: '15%',
        className: 'whitespace-nowrap',
      },
      cell: ({ getValue }) => (
        <span className="text-sm">{humanize(getValue() ?? 0)}</span>
      ),
    }),
  ];
}

export const cachedImages = columnHelper.accessor(
  (node) => node.status?.images?.length ?? 0,
  {
    id: 'cachedImages',
    header: 'Cached Images',
    cell: (props) => (
      <CachedImagesCell
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    ),
  }
);

function CachedImagesCell({
  row: { original: node },
}: CellContext<NodeRowData, number>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nodeName = node.metadata?.name ?? 'node';
  const images: NodeImage[] = node.status?.images ?? [];

  return (
    <>
      <Button
        color="link"
        onClick={() => setIsModalOpen(true)}
        icon={Layers}
        className="!px-0"
        data-cy={`node-cached-images-${nodeName}`}
      >
        {images.length}
      </Button>

      {isModalOpen && (
        <CachedImagesModal
          nodeName={nodeName}
          images={images}
          onDismiss={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function CachedImagesModal({
  nodeName,
  images,
  onDismiss,
}: {
  nodeName: string;
  images: NodeImage[];
  onDismiss: () => void;
}) {
  const tableState = useTableStateWithoutStorage('sizeBytes', true);
  const { t } = useTranslation();

  const rows = useMemo(
    () =>
      [...images]
        .sort((left, right) => (right.sizeBytes ?? 0) - (left.sizeBytes ?? 0))
        .map((image, index) => {
          const names = image.names ?? [];
          const primaryName = names[0] ?? '<untagged>';
          const aliases = names.slice(1).join(' ');
          const sizeBytes = image.sizeBytes ?? 0;
          return {
            id: `${primaryName}-${sizeBytes}-${index}`,
            image: primaryName,
            aliases,
            aliasesCount: Math.max(names.length - 1, 0),
            sizeBytes,
          };
        }),
    [images]
  );
  const totalSizeBytes = useMemo(
    () => rows.reduce((current, image) => current + image.sizeBytes, 0),
    [rows]
  );

  return (
    <Modal
      onDismiss={onDismiss}
      aria-label={t('kubernetes.cluster.nodes.cachedImages.ariaLabel', { nodeName })}
      dialogClassName="w-[min(1320px,calc(100vw-2rem))]"
      className="pr-10 pt-7"
    >
      <ModalBody>
        {images.length === 0 && (
          <div className="text-muted">
            {t('kubernetes.cluster.nodes.cachedImages.empty')}
          </div>
        )}
        {images.length > 0 && (
          <Datatable<CachedImageRow>
            disableSelect
            dataset={rows}
            columns={getCachedImageColumns(t)}
            settingsManager={tableState}
            title={t('kubernetes.cluster.nodes.cachedImages.title', { nodeName })}
            titleIcon={Layers}
            description={t('kubernetes.cluster.nodes.cachedImages.description', {
              count: rows.length,
              totalSize: humanize(totalSizeBytes),
            })}
            getRowId={(row) => row.id}
            data-cy="cached-images-datatable"
          />
        )}
      </ModalBody>
    </Modal>
  );
}
