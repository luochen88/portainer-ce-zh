import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { queryKeys } from './query-keys';

type Payload = {
  environmentId: EnvironmentId;
  namespace: string;
  name: string;
  secretNames: string[];
};

export function useUpdateServiceAccountImagePullSecretsMutation(
  environmentId: EnvironmentId
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceAccountImagePullSecrets,
    onSuccess: (_data, { namespace, name }) => {
      queryClient.invalidateQueries(
        queryKeys.detail(environmentId, namespace, name)
      );
      queryClient.invalidateQueries(queryKeys.base(environmentId));
    },
    ...withError(i18n.t('kubernetes.moreResources.serviceAccounts.imagePullSecrets.errors.update')),
  });
}

async function updateServiceAccountImagePullSecrets({
  environmentId,
  namespace,
  name,
  secretNames,
}: Payload) {
  try {
    await axios.put(
      `kubernetes/${environmentId}/namespaces/${namespace}/service_accounts/${name}/image_pull_secrets`,
      { secretNames }
    );
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.serviceAccounts.imagePullSecrets.errors.update'));
  }
}
