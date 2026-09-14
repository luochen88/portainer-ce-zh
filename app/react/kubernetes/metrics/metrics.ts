import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import i18n from '@/i18n';

import { NodeMetrics } from './types';

export async function getMetricsForAllNodes(environmentId: EnvironmentId) {
  try {
    const { data: nodes } = await axios.get<NodeMetrics>(
      `kubernetes/${environmentId}/metrics/nodes`
    );
    return nodes;
  } catch (e) {
    throw parseAxiosError(e, i18n.t('kubernetes.metrics.errors.allNodes'));
  }
}
