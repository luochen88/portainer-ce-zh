import { useMutation, useQueryClient } from '@tanstack/react-query';

import i18n from '@/i18n';
import { EnvironmentId } from '@/react/portainer/environments/types';
import axios from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';
import { notifySuccess } from '@/portainer/services/notifications';
import { PersistentVolume } from '@/react/kubernetes/volumes/ListView/types';

import { queryKeys } from './query-keys';

export function useDeletePersistentVolumes(environmentId: EnvironmentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (volumes: PersistentVolume[]) =>
      deleteVolumes(volumes, environmentId),
    onSuccess: () => {
      notifySuccess(i18n.t('kubernetes.common.notifications.success'), i18n.t('kubernetes.volumes.persistentVolumes.notifications.removed'));
      queryClient.invalidateQueries(queryKeys.storages(environmentId));
      return queryClient.invalidateQueries(queryKeys.volumes(environmentId));
    },
    ...withError(i18n.t('kubernetes.volumes.persistentVolumes.notifications.removeFailure')),
  });
}

function deleteVolumes(
  volumes: PersistentVolume[],
  environmentId: EnvironmentId
) {
  return axios.post(
    `/kubernetes/${environmentId}/persistent_volumes/delete`,
    volumes.map((v) => v.name)
  );
}
