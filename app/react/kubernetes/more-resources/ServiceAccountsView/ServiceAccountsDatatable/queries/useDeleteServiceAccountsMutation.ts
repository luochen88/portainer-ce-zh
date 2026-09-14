import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys } from './query-keys';

export function useDeleteServiceAccountsMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation(deleteServiceAccounts, {
    onSuccess: () =>
      queryClient.invalidateQueries(queryKeys.list(environmentId)),
    ...withError(i18n.t('kubernetes.moreResources.serviceAccounts.errors.delete')),
  });
}

export async function deleteServiceAccounts({
  environmentId,
  data,
}: {
  environmentId: EnvironmentId;
  data: Record<string, string[]>;
}) {
  try {
    return await axios.post(
      `kubernetes/${environmentId}/service_accounts/delete`,
      data
    );
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.serviceAccounts.errors.delete'));
  }
}
