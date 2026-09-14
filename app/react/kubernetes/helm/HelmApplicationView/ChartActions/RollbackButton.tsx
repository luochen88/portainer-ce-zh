import { RotateCcw } from 'lucide-react';
import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { LoadingButton } from '@@/buttons';
import { buildConfirmButton } from '@@/modals/utils';
import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';

import { useHelmRollbackMutation } from '../../helmReleaseQueries/useHelmRollbackMutation';

type Props = {
  latestRevision: number;
  selectedRevision?: number;
  environmentId: EnvironmentId;
  releaseName: string;
  namespace?: string;
};

export function RollbackButton({
  latestRevision,
  selectedRevision,
  environmentId,
  releaseName,
  namespace,
}: Props) {
  const { t } = useTranslation();
  // when the latest revision is selected, rollback to the previous revision
  // otherwise, rollback to the selected revision
  const rollbackRevision =
    selectedRevision === latestRevision ? latestRevision - 1 : selectedRevision;
  const router = useRouter();
  const rollbackMutation = useHelmRollbackMutation(environmentId);

  return (
    <LoadingButton
      onClick={handleClick}
      isLoading={rollbackMutation.isLoading}
      loadingText={t('kubernetes.helm.release.actions.rollingBack')}
      data-cy="rollback-button"
      icon={RotateCcw}
      color="default"
      size="medium"
    >
      Rollback to #{rollbackRevision}
    </LoadingButton>
  );

  async function handleClick() {
    const confirmed = await confirm({
      title: t('kubernetes.common.areYouSure'),
      modalType: ModalType.Warn,
      confirmButton: buildConfirmButton(t('kubernetes.helm.release.actions.rollback')),
      message: t('kubernetes.helm.release.confirm.rollback', { revision: rollbackRevision.toString() }),
    });
    if (!confirmed) {
      return;
    }

    rollbackMutation.mutate(
      {
        releaseName,
        params: { namespace, revision: rollbackRevision },
      },
      {
        onSuccess: () => {
          notifySuccess(
            t('kubernetes.common.success'),
            t('kubernetes.helm.release.notifications.rollbackSuccess', { revision: rollbackRevision.toString() })
          );
          // set the revision url param to undefined to refresh the page at the latest revision
          router.stateService.go('kubernetes.helm', {
            namespace,
            name: releaseName,
            revision: undefined,
          });
        },
      }
    );
  }
}
