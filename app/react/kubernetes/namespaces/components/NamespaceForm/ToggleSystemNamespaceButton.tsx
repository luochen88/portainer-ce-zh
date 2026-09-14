import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';
import { notifySuccess } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { LoadingButton } from '@@/buttons';
import { confirmUpdate } from '@@/modals/confirm';

import { useToggleSystemNamespaceMutation } from '../../queries/useToggleSystemNamespace';

export function ToggleSystemNamespaceButton({
  isSystemNamespace,
  isEdit,
  environmentId,
  namespaceName,
}: {
  isSystemNamespace: boolean;
  isEdit: boolean;
  environmentId: EnvironmentId;
  namespaceName: string;
}) {
  const { t } = useTranslation();
  const toggleSystemNamespaceMutation = useToggleSystemNamespaceMutation(
    environmentId,
    namespaceName
  );
  if (!isEdit) {
    return null;
  }

  return (
    <LoadingButton
      onClick={markUnmarkAsSystem}
      className="!ml-0"
      data-cy="mark-as-system-button"
      color="default"
      type="button"
      loadingText={
        isSystemNamespace
          ? t('kubernetes.namespaces.form.system.unmarking')
          : t('kubernetes.namespaces.form.system.marking')
      }
      isLoading={toggleSystemNamespaceMutation.isLoading}
    >
      {isSystemNamespace
        ? t('kubernetes.namespaces.form.system.unmark')
        : t('kubernetes.namespaces.form.system.mark')}
    </LoadingButton>
  );

  async function markUnmarkAsSystem() {
    const confirmed = await confirmMarkUnmarkAsSystem(isSystemNamespace);
    if (confirmed) {
      toggleSystemNamespaceMutation.mutate(!isSystemNamespace, {
        onSuccess: () => {
          notifySuccess(
            t('kubernetes.common.notifications.success'),
            t('kubernetes.namespaces.notifications.updatedGeneric')
          );
        },
      });
    }
  }
}

async function confirmMarkUnmarkAsSystem(isSystemNamespace: boolean) {
  const message = isSystemNamespace
    ? i18n.t('kubernetes.namespaces.form.system.unmarkConfirm')
    : i18n.t('kubernetes.namespaces.form.system.markConfirm');

  return new Promise((resolve) => {
    confirmUpdate(message, resolve);
  });
}
