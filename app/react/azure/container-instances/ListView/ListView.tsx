import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { deleteContainerGroup } from '@/react/azure/services/container-groups.service';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { promiseSequence } from '@/portainer/helpers/promise-utils';
import { useContainerGroups } from '@/react/azure/queries/useContainerGroups';
import { useSubscriptions } from '@/react/azure/queries/useSubscriptions';
import i18n from '@/i18n';

import { PageHeader } from '@@/PageHeader';

import { ContainersDatatable } from './ContainersDatatable';

export function ListView() {
  const { t } = useTranslation();
  const environmentId = useEnvironmentId();

  const subscriptionsQuery = useSubscriptions(environmentId);

  const groupsQuery = useContainerGroups(
    environmentId,
    subscriptionsQuery.data,
    subscriptionsQuery.isSuccess
  );

  const { handleRemove } = useRemoveMutation(environmentId);

  if (groupsQuery.isLoading || subscriptionsQuery.isLoading) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={t('azure.containerInstances.list.title')}
        breadcrumbs={t('azure.containerInstances.title')}
        reload
      />

      <ContainersDatatable
        dataset={groupsQuery.containerGroups}
        onRemoveClick={handleRemove}
      />
    </>
  );
}

function useRemoveMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (containerGroupIds: string[]) =>
      promiseSequence(
        containerGroupIds.map(
          (id) => () => deleteContainerGroup(environmentId, id)
        )
      ),

    {
      onSuccess() {
        return queryClient.invalidateQueries([
          'azure',
          environmentId,
          'subscriptions',
        ]);
      },
      onError(err) {
        notifyError(
          i18n.t('common.failure'),
          err as Error,
          i18n.t('azure.containerInstances.notifications.removeFailure')
        );
      },
    }
  );

  return { handleRemove };

  async function handleRemove(groupIds: string[]) {
    deleteMutation.mutate(groupIds, {
      onSuccess: () => {
        notifySuccess(i18n.t('common.success'), i18n.t('azure.containerInstances.notifications.removed'));
      },
    });
  }
}
