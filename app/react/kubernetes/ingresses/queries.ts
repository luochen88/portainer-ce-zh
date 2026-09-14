import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import i18n from '@/i18n';
import { EnvironmentId } from '@/react/portainer/environments/types';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import {
  getIngresses,
  getIngress,
  createIngress,
  deleteIngresses,
  updateIngress,
  getIngressControllers,
} from './service';
import { DeleteIngressesRequest, Ingress } from './types';

const queryKeys = {
  base: ['environments', 'kubernetes', 'ingress'] as const,
  clusterIngresses: (environmentId: EnvironmentId) =>
    [...queryKeys.base, String(environmentId)] as const,
  namespaceIngresses: (
    environmentId: EnvironmentId,
    namespace: string,
    ingress: string
  ) => [...queryKeys.base, String(environmentId), namespace, ingress] as const,
  ingress: (environmentId: EnvironmentId, namespace: string, name: string) =>
    [...queryKeys.base, String(environmentId), namespace, name] as const,
  ingressControllers: (environmentId: EnvironmentId, namespace: string) => [
    ...queryKeys.base,
    String(environmentId),
    namespace,
    'ingresscontrollers',
  ],
};

export function useIngress(
  environmentId: EnvironmentId,
  namespace: string,
  name: string
) {
  return useQuery(
    queryKeys.ingress(environmentId, namespace, name),
    async () => {
      const ing = await getIngress(environmentId, namespace, name);
      return ing;
    },
    {
      ...withError(i18n.t('kubernetes.ingresses.notifications.getOneFailure')),
    }
  );
}

export function useIngresses(
  environmentId: EnvironmentId,
  options?: {
    autoRefreshRate?: number;
    enabled?: boolean;
    withServices?: boolean;
  }
) {
  const { enabled, autoRefreshRate, ...params } = options ?? {};

  return useQuery(
    [...queryKeys.clusterIngresses(environmentId), params],
    async () => getIngresses(environmentId, params),
    {
      ...withError(i18n.t('kubernetes.ingresses.notifications.getFailure')),
      refetchInterval: autoRefreshRate,
      enabled,
    }
  );
}

export function useCreateIngress() {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      environmentId,
      ingress,
    }: {
      environmentId: EnvironmentId;
      ingress: Ingress;
    }) => createIngress(environmentId, ingress),
    mutationOptions(
      withError(i18n.t('kubernetes.ingresses.notifications.createFailure')),
      withInvalidate(queryClient, [queryKeys.base])
    )
  );
}

export function useUpdateIngress() {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      environmentId,
      ingress,
    }: {
      environmentId: EnvironmentId;
      ingress: Ingress;
    }) => updateIngress(environmentId, ingress),
    mutationOptions(
      withError(i18n.t('kubernetes.ingresses.notifications.updateFailure')),
      withInvalidate(queryClient, [queryKeys.base])
    )
  );
}

export function useDeleteIngresses() {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      environmentId,
      data,
    }: {
      environmentId: EnvironmentId;
      data: DeleteIngressesRequest;
    }) => deleteIngresses(environmentId, data),
    mutationOptions(
      withError(i18n.t('kubernetes.ingresses.notifications.updateFailure')),
      withInvalidate(queryClient, [queryKeys.base])
    )
  );
}

/**
 * Ingress Controllers
 */
export function useIngressControllers(
  environmentId: EnvironmentId,
  namespace?: string,
  allowedOnly?: boolean
) {
  return useQuery(
    queryKeys.ingressControllers(environmentId, namespace ?? ''),
    async () =>
      namespace
        ? getIngressControllers(environmentId, namespace, allowedOnly)
        : [],
    {
      enabled: !!namespace,
      ...withError(i18n.t('kubernetes.ingresses.notifications.getControllersFailure')),
    }
  );
}
