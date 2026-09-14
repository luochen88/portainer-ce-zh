import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton } from '@@/buttons/DeleteButton';

import { useUninstallHelmAppMutation } from '../../helmReleaseQueries/useUninstallHelmAppMutation';

export function UninstallButton({
  environmentId,
  releaseName,
  namespace,
}: {
  environmentId: EnvironmentId;
  releaseName: string;
  namespace?: string;
}) {
  const uninstallHelmAppMutation = useUninstallHelmAppMutation(environmentId);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <DeleteButton
      size="medium"
      data-cy="k8sApp-removeHelmChartButton"
      isLoading={uninstallHelmAppMutation.isLoading}
      confirmMessage={t('kubernetes.helm.release.confirm.uninstall')}
      onConfirmed={handleUninstall}
    >
      {t('kubernetes.helm.release.actions.uninstall')}
    </DeleteButton>
  );

  function handleUninstall() {
    uninstallHelmAppMutation.mutate(
      { releaseName, namespace },
      {
        onSuccess: () => {
          router.stateService.go('kubernetes.applications', {
            endpointId: environmentId,
          });
          notifySuccess(t('kubernetes.common.success'), t('kubernetes.helm.release.notifications.uninstallSuccess'));
        },
      }
    );
  }
}
