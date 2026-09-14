import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n';

import { withError } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { CronJob } from '../types';

import { queryKeys } from './query-keys';

export function useCronJobs(
  environmentId: EnvironmentId,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  return useQuery(
    queryKeys.list(environmentId),
    async () => getAllCronJobs(environmentId),
    {
      ...withError(i18n.t('kubernetes.moreResources.cronJobs.errors.get')),
      refetchInterval() {
        return options?.refetchInterval ?? false;
      },
      enabled: options?.enabled,
    }
  );
}

async function getAllCronJobs(environmentId: EnvironmentId) {
  try {
    const { data: cronJobs } = await axios.get<CronJob[]>(
      `kubernetes/${environmentId}/cron_jobs`
    );

    return cronJobs;
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.moreResources.cronJobs.errors.get'));
  }
}
