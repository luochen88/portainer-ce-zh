import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';

import { HelmRelease } from '../types';

import { queryKeys } from './query-keys';

export function useHelmHistory(
  environmentId: EnvironmentId,
  name: string,
  namespace: string
) {
  return useQuery(
    queryKeys.releaseHistory(environmentId, namespace, name),
    () => getHelmHistory(environmentId, name, namespace),
    {
      enabled: !!environmentId && !!name && !!namespace,
      ...withError(i18n.t('kubernetes.helm.release.errors.history')),
      retry: 3,
      // occasionally the application shows before the release is created, take some more time to refetch
      retryDelay: 2000,
    }
  );
}

async function getHelmHistory(
  environmentId: EnvironmentId,
  name: string,
  namespace: string
) {
  try {
    const response = await axios.get<HelmRelease[]>(
      `endpoints/${environmentId}/kubernetes/helm/${name}/history`,
      {
        params: { namespace },
      }
    );

    return response.data;
  } catch (error) {
    throw parseAxiosError(error, i18n.t('kubernetes.helm.release.errors.history'));
  }
}
