import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError, withInvalidate } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys } from './query-keys';

export function useDeleteClusterRoleBindingsMutation(
  environmentId: EnvironmentId
) {
  const queryClient = useQueryClient();
  return useMutation(deleteClusterRoleBindings, {
    ...withInvalidate(queryClient, [queryKeys.list(environmentId)]),
    ...withError(i18n.t('kubernetes.moreResources.clusterRoleBindings.errors.delete')),
  });
}

export async function deleteClusterRoleBindings({
  environmentId,
  data,
}: {
  environmentId: EnvironmentId;
  data: string[];
}) {
  try {
    return await axios.post(
      `kubernetes/${environmentId}/cluster_role_bindings/delete`,
      data
    );
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.clusterRoleBindings.errors.delete'));
  }
}
