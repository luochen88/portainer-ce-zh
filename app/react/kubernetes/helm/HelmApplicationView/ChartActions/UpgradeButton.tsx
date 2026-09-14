import { ArrowUp } from 'lucide-react';
import { useRouter } from '@uirouter/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';
import { semverCompare } from '@/react/common/semver-utils';

import { Button, LoadingButton } from '@@/buttons';
import { InlineLoader } from '@@/InlineLoader';
import { Tooltip } from '@@/Tip/Tooltip';
import { Link } from '@@/Link';

import { HelmRelease, UpdateHelmReleasePayload } from '../../types';
import { useUpdateHelmReleaseMutation } from '../../helmReleaseQueries/useUpdateHelmReleaseMutation';
import { useHelmRepoVersions } from '../../helmChartSourceQueries/useHelmRepoVersions';
import { useHelmRelease } from '../../helmReleaseQueries/useHelmRelease';
import {
  flattenHelmRegistries,
  useUserHelmRepositories,
} from '../../helmChartSourceQueries/useHelmRepositories';

import { openUpgradeHelmModal } from './UpgradeHelmModal';

export function UpgradeButton({
  environmentId,
  releaseName,
  namespace,
  release,
  updateRelease,
}: {
  environmentId: EnvironmentId;
  releaseName: string;
  namespace: string;
  release?: HelmRelease;
  updateRelease: (release: HelmRelease) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [useCache, setUseCache] = useState(true);
  const updateHelmReleaseMutation = useUpdateHelmReleaseMutation(environmentId);

  const userRepositoriesQuery = useUserHelmRepositories({
    select: flattenHelmRegistries,
  });
  const helmRepoVersionsQuery = useHelmRepoVersions(
    release?.chart.metadata?.name || '',
    60 * 60 * 1000, // 1 hour
    userRepositoriesQuery.data?.map((repo) => ({
      repo,
    })),
    useCache
  );
  const versions = helmRepoVersionsQuery.data;

  // Combined loading state
  const isLoading =
    userRepositoriesQuery.isInitialLoading || helmRepoVersionsQuery.isFetching; // use 'isFetching' for helmRepoVersionsQuery because we want to show when it's refetching
  const isError =
    userRepositoriesQuery.isError || helmRepoVersionsQuery.isError;
  const latestVersionQuery = useHelmRelease(
    environmentId,
    releaseName,
    namespace,
    {
      select: (data) => data.chart.metadata?.version,
    }
  );
  const latestVersionAvailable = versions[0]?.Version ?? '';
  const isNewVersionAvailable = Boolean(
    latestVersionQuery?.data &&
    semverCompare(latestVersionAvailable, latestVersionQuery?.data) === 1
  );

  const currentRepo = versions?.find(
    (v) =>
      v.Repo === release?.chartReference?.repoURL &&
      v.AppVersion === release?.chart.metadata?.appVersion &&
      v.Version === release?.chart.metadata?.version
  )?.Repo;

  const editableHelmRelease: UpdateHelmReleasePayload = {
    name: releaseName,
    namespace: namespace || '',
    values: release?.values?.userSuppliedValues,
    chart: release?.chart.metadata?.name || '',
    appVersion: release?.chart.metadata?.appVersion,
    version: release?.chart.metadata?.version,
    repo: currentRepo ?? '',
  };

  const filteredVersions = currentRepo
    ? versions?.filter((v) => v.Repo === currentRepo) || []
    : versions || [];

  return (
    <div className="relative">
      <LoadingButton
        color="secondary"
        data-cy="k8sApp-upgradeHelmChartButton"
        onClick={handleUpgrade}
        disabled={
          versions.length === 0 ||
          isLoading ||
          isError ||
          release?.info?.status?.startsWith('pending')
        }
        loadingText={t('kubernetes.helm.release.actions.upgrading')}
        isLoading={updateHelmReleaseMutation.isLoading}
        icon={ArrowUp}
        size="medium"
      >
        {t('kubernetes.helm.release.actions.editUpgrade')}
      </LoadingButton>
      {isLoading && (
        <InlineLoader
          size="xs"
          className="absolute -bottom-5 left-0 right-0 whitespace-nowrap"
        >
          {t('kubernetes.helm.release.status.checkingVersions')}
        </InlineLoader>
      )}
      {!isLoading && !isError && (
        <span className="text-muted absolute -bottom-5 left-0 right-0 flex items-center whitespace-nowrap text-center text-xs">
          {getStatusMessage(
            versions.length === 0,
            latestVersionAvailable,
            isNewVersionAvailable,
            t
          )}
          {versions.length === 0 && (
            <Tooltip
              message={
                <div>
                  {t('kubernetes.helm.release.status.noVersionsTooltip')}{' '}
                  <Link
                    to="portainer.account"
                    params={{ '#': 'helm-repositories' }}
                    data-cy="user-settings-link"
                  >
                    {t('kubernetes.helm.repositories.settings')}
                  </Link>
                </div>
              }
            />
          )}
          <Button
            data-cy="k8sApp-refreshHelmChartVersionsButton"
            color="link"
            size="xsmall"
            onClick={handleRefreshVersions}
            type="button"
          >
            {t('kubernetes.common.actions.refresh')}
          </Button>
        </span>
      )}
    </div>
  );

  function handleRefreshVersions() {
    if (useCache) {
      // clicking 'refresh versions' should get the latest versions from the repo, not the cached versions
      setUseCache(false);
    }
    helmRepoVersionsQuery.refetch();
  }

  async function handleUpgrade() {
    const submittedUpgradeValues = await openUpgradeHelmModal(
      editableHelmRelease,
      filteredVersions,
      release?.manifest || '',
      environmentId
    );

    if (submittedUpgradeValues) {
      upgrade(submittedUpgradeValues, release);
    }

    function upgrade(payload: UpdateHelmReleasePayload, release?: HelmRelease) {
      if (release?.info) {
        const updatedRelease = {
          ...release,
          info: {
            ...release.info,
            status: 'pending-upgrade',
            description: t('kubernetes.helm.release.status.preparingUpgrade'),
          },
        };
        updateRelease(updatedRelease);
      }
      updateHelmReleaseMutation.mutate(payload, {
        onSuccess: () => {
          notifySuccess(t('kubernetes.common.success'), t('kubernetes.helm.release.notifications.upgradeSuccess'));
          // set the revision url param to undefined to refresh the page at the latest revision
          router.stateService.go('kubernetes.helm', {
            namespace,
            name: releaseName,
            revision: undefined,
          });
        },
      });
    }
  }
}

function getStatusMessage(
  hasNoAvailableVersions: boolean,
  latestVersionAvailable: string,
  isNewVersionAvailable: boolean,
  t: (key: string, options?: Record<string, string>) => string
) {
  if (hasNoAvailableVersions) {
    return t('kubernetes.helm.release.status.noVersionsAvailable');
  }
  if (isNewVersionAvailable) {
    return t('kubernetes.helm.release.status.newVersionAvailable', {
      version: latestVersionAvailable,
    });
  }
  return t('kubernetes.helm.release.status.latestVersionInstalled');
}
