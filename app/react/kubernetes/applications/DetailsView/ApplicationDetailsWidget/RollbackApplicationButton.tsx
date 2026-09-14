import { Pod } from 'kubernetes-types/core/v1';
import { RotateCcw } from 'lucide-react';
import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { Authorized } from '@/react/hooks/useUser';
import { notifySuccess, notifyError } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';
import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { Tooltip } from '@@/Tip/Tooltip';

import {
  applicationIsKind,
  getRollbackPatchPayload,
  matchLabelsToLabelSelectorValue,
} from '../../utils';
import { Application } from '../../types';
import { appDeployMethodLabel } from '../../constants';
import { useApplicationRevisionList } from '../../queries/useApplicationRevisionList';
import { usePatchApplicationMutation } from '../../queries/usePatchApplicationMutation';

type Props = {
  environmentId: EnvironmentId;
  namespace: string;
  appName: string;
  app?: Application;
};

export function RollbackApplicationButton({
  environmentId,
  namespace,
  appName,
  app,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const labelSelector = applicationIsKind<Pod>('Pod', app)
    ? ''
    : matchLabelsToLabelSelectorValue(app?.spec?.selector?.matchLabels);
  const appRevisionListQuery = useApplicationRevisionList(
    environmentId,
    namespace,
    appName,
    app?.metadata?.uid,
    labelSelector,
    app?.kind
  );
  const appRevisionList = appRevisionListQuery.data;
  const appRevisions = appRevisionList?.items;
  const appDeployMethod =
    app?.metadata?.labels?.[appDeployMethodLabel] || 'application form';

  const patchAppMutation = usePatchApplicationMutation(
    environmentId,
    namespace,
    appName
  );

  const isRollbackNotAvailable =
    !app ||
    !appRevisions ||
    appRevisions?.length < 2 ||
    appDeployMethod !== 'application form' ||
    patchAppMutation.isLoading;

  const rollbackButton = (
    <Button
      ng-if="!ctrl.isExternalApplication()"
      type="button"
      color="light"
      size="small"
      className="!ml-0"
      disabled={isRollbackNotAvailable}
      onClick={() => rollbackApplication()}
      data-cy="k8sAppDetail-rollbackButton"
    >
      <Icon icon={RotateCcw} className="mr-1" />
      {t('kubernetes.applications.details.actions.rollback.label')}
    </Button>
  );

  return (
    <Authorized authorizations="K8sApplicationDetailsW">
      <div className="flex gap-x-2">
        {isRollbackNotAvailable ? (
          <TooltipWithChildren message={t('kubernetes.applications.details.actions.rollback.unavailableTooltip')}>
            <span>{rollbackButton}</span>
          </TooltipWithChildren>
        ) : (
          rollbackButton
        )}
        <Tooltip message={t('kubernetes.applications.details.actions.rollback.infoTooltip')} />
      </div>
    </Authorized>
  );

  async function rollbackApplication() {
    // exit early if the application is a pod or there are no revisions
    if (
      !app?.kind ||
      applicationIsKind<Pod>('Pod', app) ||
      !appRevisionList?.items?.length
    ) {
      return;
    }

    // confirm the action
    const confirmed = await confirm({
      title: t('kubernetes.common.confirm.areYouSure'),
      modalType: ModalType.Warn,
      confirmButton: buildConfirmButton(t('kubernetes.applications.details.actions.rollback.confirmButton')),
      message: t('kubernetes.applications.details.actions.rollback.confirmMessage'),
    });
    if (!confirmed) {
      return;
    }

    try {
      const patch = getRollbackPatchPayload(app, appRevisionList);
      patchAppMutation.mutateAsync(
        {
          appKind: app.kind,
          patch,
          contentType:
            app.kind === 'Deployment'
              ? 'application/json-patch+json'
              : 'application/strategic-merge-patch+json',
        },
        {
          onSuccess: () => {
            notifySuccess(
              t('kubernetes.common.notifications.success'),
              t('kubernetes.applications.details.actions.rollback.notifications.success')
            );
            router.stateService.reload();
          },
          onError: (error) =>
            notifyError(
              t('kubernetes.common.notifications.failure'),
              error as Error,
              t('kubernetes.applications.details.actions.rollback.notifications.unableToRollback')
            ),
        }
      );
    } catch (error) {
      notifyError(t('kubernetes.common.notifications.failure'), error as Error);
    }
  }
}
