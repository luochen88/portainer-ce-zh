import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { RoleBinding } from '../types';

import { queryKeys } from './query-keys';

export function useRoleBindings(
  environmentId: EnvironmentId,
  options?: { autoRefreshRate?: number; enabled?: boolean }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getAllRoleBindings(environmentId),
    {
      ...withError(i18n.t('kubernetes.moreResources.roleBindings.errors.get')),
      refetchInterval() {
        return options?.autoRefreshRate ?? false;
      },
      enabled: options?.enabled,
    }
  );
}

async function getAllRoleBindings(environmentId: EnvironmentId) {
  try {
    const { data: roleBinding } = await axios.get<RoleBinding[]>(
      `kubernetes/${environmentId}/role_bindings`
    );

    return roleBinding;
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.roleBindings.errors.get'));
  }
}
