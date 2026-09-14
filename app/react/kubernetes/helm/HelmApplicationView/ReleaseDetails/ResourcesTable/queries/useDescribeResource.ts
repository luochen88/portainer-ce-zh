import { useQuery } from '@tanstack/react-query';
import i18n from '@/i18n';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import axios, { parseAxiosError } from '@/portainer/services/axios/axios';
import { withError } from '@/react-tools/react-query';

type DescribeAPIParams = {
  name: string;
  kind: string;
  namespace?: string;
};

type DescribeResourceResponse = {
  describe: string;
};

async function getDescribeResource(
  environmentId: number,
  name: string,
  resourceType?: string,
  namespace?: string
) {
  try {
    // This should never happen, but to keep the linter happy...
    if (!name || !resourceType) {
      throw new Error(i18n.t('kubernetes.helm.resources.errors.nameAndKindRequired'));
    }

    const params: DescribeAPIParams = {
      name,
      namespace,
      kind: resourceType,
    };

    const { data } = await axios.get<DescribeResourceResponse>(
      `kubernetes/${environmentId}/describe`,
      {
        params,
      }
    );
    return data;
  } catch (err) {
    throw parseAxiosError(err, i18n.t('kubernetes.helm.resources.errors.describe'));
  }
}

export function useDescribeResource(
  name: string,
  resourceType?: string,
  namespace?: string
) {
  const environmentId = useEnvironmentId();

  return useQuery(
    [environmentId, 'kubernetes', 'describe', namespace, resourceType, name],
    () => getDescribeResource(environmentId, name, resourceType, namespace),
    {
      enabled: !!environmentId && !!name && !!resourceType,
      ...withError(i18n.t('kubernetes.helm.resources.errors.describeQuery')),
    }
  );
}
