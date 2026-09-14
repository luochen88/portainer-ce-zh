import { RotateCw } from 'lucide-react';
import { Pod } from 'kubernetes-types/core/v1';
import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess, notifyError } from '@/portainer/services/notifications';
import { Authorized } from '@/react/hooks/useUser';

import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';
import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

import { Application } from '../../types';
import {
  applicationIsKind,
  matchLabelsToLabelSelectorValue,
} from '../../utils';
import { useRedeployApplicationMutation } from '../../queries/useRedeployApplicationMutation';

type Props = {
  environmentId: EnvironmentId;
  namespace: string;
  appName: string;
  app?: Application;
};

export function RedeployApplicationButton({
  environmentId,
  namespace,
  appName,
  app,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const redeployAppMutation = useRedeployApplicationMutation(
    environmentId,
    namespace,
    appName
  );

  return (
    <Authorized authorizations="K8sPodDelete">
      <Button
        type="button"
        size="small"
        color="light"
        className="!ml-0"
        disabled={redeployAppMutation.isLoading || !app}
        onClick={() => redeployApplication()}
        data-cy="k8sAppDetail-redeployButton"
      >
        <Icon icon={RotateCw} className="mr-1" />
        {t('kubernetes.applications.details.actions.redeploy.label')}
      </Button>
    </Authorized>
  );

  async function redeployApplication() {
    // validate
    if (!app || applicationIsKind<Pod>('Pod', app)) {
      return;
    }
    try {
      if (!app?.spec?.selector?.matchLabels) {
        throw new Error(
          t('kubernetes.applications.details.actions.redeploy.errors.noMatchLabels')
        );
      }
    } catch (error) {
      notifyError(t('kubernetes.common.notifications.failure'), error as Error);
      return;
    }

    // confirm the action
    const confirmed = await confirm({
      title: t('kubernetes.common.confirm.areYouSure'),
      modalType: ModalType.Warn,
      confirmButton: buildConfirmButton(t('kubernetes.applications.details.actions.redeploy.confirmButton')),
      message: t('kubernetes.applications.details.actions.redeploy.confirmMessage'),
    });
    if (!confirmed) {
      return;
    }

    // using the matchlabels object, delete the associated pods with redeployAppMutation
    const labelSelector = matchLabelsToLabelSelectorValue(
      app?.spec?.selector?.matchLabels
    );
    redeployAppMutation.mutateAsync(
      { labelSelector },
      {
        onSuccess: () => {
          notifySuccess(
            t('kubernetes.common.notifications.success'),
            t('kubernetes.applications.details.actions.redeploy.notifications.success')
          );
          router.stateService.reload();
        },
      }
    );
  }
}
