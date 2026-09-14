import { useMutation, useQueryClient } from '@tanstack/react-query';

import i18n from '@/i18n';
import { EnvironmentId } from '@/react/portainer/environments/types';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';

import { queryKeys } from './query-keys';

interface ResizePVCPayload {
  namespace: string;
  name: string;
  newSize: string;
}

export function useResizePVC(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResizePVCPayload) =>
      resizePVC(payload, environmentId),
    onSuccess: () => {
      notifySuccess(i18n.t('kubernetes.common.notifications.success'), i18n.t('kubernetes.volumes.claims.resize.notifications.success'));
      return queryClient.invalidateQueries(queryKeys.volumes(environmentId));
    },
    ...withError(i18n.t('kubernetes.volumes.claims.resize.notifications.failure')),
  });
}

function resizePVC(payload: ResizePVCPayload, environmentId: EnvironmentId) {
  return axios.put(
    `/kubernetes/${environmentId}/persistent_volume_claims/resize`,
    payload
  );
}
