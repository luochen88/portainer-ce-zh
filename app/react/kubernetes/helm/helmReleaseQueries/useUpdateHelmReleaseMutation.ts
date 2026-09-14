import { useQueryClient, useMutation } from '@tanstack/react-query';
import i18n from '@/i18n';

import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { withError, withInvalidate } from '@/react-tools/react-query';
import { queryKeys as applicationsQueryKeys } from '@/react/kubernetes/applications/queries/query-keys';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { HelmRelease, UpdateHelmReleasePayload } from '../types';

import { queryKeys } from './query-keys';

export function useUpdateHelmReleaseMutation(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateHelmReleasePayload) =>
      updateHelmRelease(environmentId, payload),
    ...withInvalidate(queryClient, [
      queryKeys.releases(environmentId),
      applicationsQueryKeys.applications(environmentId),
    ]),
    ...withError(i18n.t('kubernetes.helm.release.errors.update')),
  });
}

type UpdateHelmReleaseParams = {
  dryRun?: boolean;
};

type UpdateHelmReleaseOptions = {
  errorMessage?: string;
};

export async function updateHelmRelease(
  environmentId: EnvironmentId,
  payload: UpdateHelmReleasePayload,
  params: UpdateHelmReleaseParams = {},
  options: UpdateHelmReleaseOptions = {}
) {
  try {
    const { data } = await axios.post<HelmRelease>(
      `endpoints/${environmentId}/kubernetes/helm`,
      payload,
      {
        params,
      }
    );
    return data;
  } catch (err) {
    throw parseAxiosError(
      err,
      options.errorMessage ?? i18n.t('kubernetes.helm.release.errors.update')
    );
  }
}
