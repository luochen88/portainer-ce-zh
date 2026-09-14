import { compact } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { ClusterRole } from '../types';

import { queryKeys } from './query-keys';

export function useClusterRoles(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => {
      const clusterRoles = await getClusterRoles(environmentId);
      return compact(clusterRoles);
    },
    {
      ...withError(i18n.t('kubernetes.moreResources.clusterRoles.errors.get')),
      refetchInterval: options?.autoRefreshRate,
    }
  );
}

async function getClusterRoles(environmentId: EnvironmentId) {
  try {
    const { data: roles } = await axios.get<ClusterRole[]>(
      `kubernetes/${environmentId}/cluster_roles`
    );

    return roles;
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.clusterRoles.errors.get'));
  }
}
