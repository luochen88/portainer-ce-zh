import { compact } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { ClusterRoleBinding } from '../types';

import { queryKeys } from './query-keys';

export function useClusterRoleBindings(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => {
      const cluerRoleBindings = await getClusterRoleBindings(environmentId);
      return compact(cluerRoleBindings);
    },
    {
      ...withError(i18n.t('kubernetes.moreResources.clusterRoleBindings.errors.get')),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
    }
  );
}

async function getClusterRoleBindings(environmentId: EnvironmentId) {
  try {
    const { data: roles } = await axios.get<ClusterRoleBinding[]>(
      `kubernetes/${environmentId}/cluster_role_bindings`
    );

    return roles;
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.clusterRoleBindings.errors.get'));
  }
}
