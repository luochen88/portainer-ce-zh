import React, { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import {
  Environment,
  EnvironmentStatus,
  PlatformType,
  EnvironmentHealth,
} from '@/react/portainer/environments/types';
import {
  refetchIfAnyOffline,
  SortType,
  useEnvironmentList,
} from '@/react/portainer/environments/queries/useEnvironmentList';
import { useGroups } from '@/react/portainer/environments/environment-groups/queries';
import { EnvironmentsQueryParams } from '@/react/portainer/environments/environment.service';
import { useIsPureAdmin } from '@/react/hooks/useUser';
import {
  getPlatformType,
  isEdgeEnvironment,
} from '@/react/portainer/environments/utils';
import { useEnvironmentSummaryCounts } from '@/react/portainer/environments/queries/useEnvironmentSummaryCounts';
import { useParseSortGroupApiParams } from '@/react/portainer/environments/queries/useParseApiSortParams';
import { useBaseApiQueryParams } from '@/react/portainer/environments/queries/useBaseApiQueryParams';
import { useAvailableSortGroups } from '@/react/portainer/environments/queries/useAvailableSortGroups';
import { getPlatformIconByPlatform } from '@/react/portainer/environments/utils/get-platform-icon';
import { getHealthIcon } from '@/react/portainer/environments/utils/get-health-icon';
import { getGroupIcon } from '@/react/portainer/environments/utils/get-group-icon';
import { UpdateBadge } from '@/react/portainer/HomeView/EnvironmentList/UpdateBadge';
import { KubeconfigButton } from '@/react/portainer/HomeView/EnvironmentList/KubeconfigButton';
import { EnvironmentCard } from '@/react/portainer/HomeView/EnvironmentList/EnvironmentItem/EnvironmentCard';

import { DropdownOption } from '@@/DropdownMenu/DropdownMenu';
import {
  SortableGroup,
  SortableList,
  SortOption,
} from '@@/SortableList/SortableList';

import { useHomeViewState } from '../useHomeViewState';

import { NoEnvironmentsInfoPanel } from './NoEnvironmentsInfoPanel';

interface Props {
  onClickBrowse(environment: Environment): void;
}



const platformDetails: Record<
  string,
  { type: PlatformType; descriptionKey: string }
> = {
  Docker: {
    type: PlatformType.Docker,
    descriptionKey: 'home.platform_docker_description',
  },
  Kubernetes: {
    type: PlatformType.Kubernetes,
    descriptionKey: 'home.platform_kubernetes_description',
  },
  Azure: { type: PlatformType.Azure, descriptionKey: 'home.platform_azure_description' },
  Podman: { type: PlatformType.Podman, descriptionKey: 'home.platform_podman_description' },
};

const healthDetails: Record<
  string,
  { type: EnvironmentHealth; descriptionKey: string }
> = {
  Up: {
    type: EnvironmentHealth.Up,
    descriptionKey: 'home.health_up_description',
  },
  Down: {
    type: EnvironmentHealth.Down,
    descriptionKey: 'home.health_down_description',
  },
  Outdated: {
    type: EnvironmentHealth.Outdated,
    descriptionKey: 'home.health_outdated_description',
  },
  Heartbeat: {
    type: EnvironmentHealth.Heartbeat,
    descriptionKey: 'home.health_heartbeat_description',
  },
};

const GROUP_FIELD: Partial<Record<SortType, (item: EnvironmentRow) => string>> =
  {
    Group: (item) => item.GroupId.toString(),
    PlatformType: (item) => item.platformName,
    Health: (item) => item.healthLabel,
  };

export function EnvironmentList({ onClickBrowse }: Props) {
  const { t } = useTranslation();

  const sortOptions = useMemo<SortOption<SortType>[]>(
    () => [
      {
        key: 'Id',
        label: t('home.sort.age'),
        descendingLabel: t('home.sort.newest'),
        ascendingLabel: t('home.sort.oldest'),
      },
      { key: 'Group', label: t('home.sort.group'), grouped: true },
      { key: 'PlatformType', label: t('home.sort.platform'), grouped: true },
      { key: 'Health', label: t('home.sort.health'), grouped: true },
    ],
    [t]
  );
  const isPureAdmin = useIsPureAdmin();
  const summaryQuery = useEnvironmentSummaryCounts();

  const tableState = useHomeViewState();

  const groupsQuery = useGroups();

  const groupDetails = useMemo(
    () =>
      Object.fromEntries(
        (groupsQuery.data ?? []).map((group) => [
          group.Id.toString(),
          { name: group.Name, description: group.Description },
        ])
      ),
    [groupsQuery.data]
  );

  const baseQueryParams: EnvironmentsQueryParams = useBaseApiQueryParams(
    tableState.search
  );

  const sortGroupApiParams = useParseSortGroupApiParams(
    tableState.groupFilter,
    tableState.groupKey,
    groupsQuery.data
  );

  const listQueryParams: EnvironmentsQueryParams = useMemo(
    () => ({ ...baseQueryParams, ...sortGroupApiParams }),
    [baseQueryParams, sortGroupApiParams]
  );

  const availableGroupsBySort = useAvailableSortGroups(summaryQuery.data);

  const sortOrder = tableState.sortBy?.desc ? 'desc' : 'asc';

  const { isLoading, environments, totalCount, updateAvailable } =
    useEnvironmentList(
      {
        page: tableState.page + 1,
        pageLimit: tableState.pageSize,
        sort: tableState.groupKey,
        order: sortOrder,
        ...listQueryParams,
      },
      { refetchInterval: refetchIfAnyOffline }
    );

  const environmentRows = useMemo<EnvironmentRow[]>(() => {
    return environments.map((env) => ({
      ...env,
      groupName: groupDetails[env.GroupId.toString()]?.name ?? 'Unassigned',
      platformName:
        PlatformType[getPlatformType(env.Type, env.ContainerEngine)],
      healthLabel: getHealthLabel(env, tableState.groupFilter),
    }));
  }, [environments, groupDetails, tableState.groupFilter]);

  const environmentGroups = useMemo(
    () =>
      buildGroups(
        environmentRows,
        tableState.groupKey,
        availableGroupsBySort,
        groupDetails,
        t
      ),
    [environmentRows, tableState.groupKey, availableGroupsBySort, groupDetails, t]
  );

  const headerButtons = [
    updateAvailable && <UpdateBadge key="update-badge" />,
    <KubeconfigButton
      key="kube-config-button"
      environments={environments}
      envQueryParams={listQueryParams}
    />,
  ].filter((btn): btn is React.ReactElement => Boolean(btn));

  return (
    <div className="flex flex-col gap-2">
      {summaryQuery.isSuccess && summaryQuery.data.total === 0 && (
        <NoEnvironmentsInfoPanel isAdmin={isPureAdmin} />
      )}
      <SortableList
        isLoading={isLoading}
        renderItem={(row: EnvironmentRow) => (
          <EnvironmentCard
            environment={row}
            groupName={row.groupName}
            onClickBrowse={() => onClickBrowse(row)}
          />
        )}
        tableState={tableState}
        sortOptions={sortOptions}
        groupOptions={availableGroupsBySort}
        totalCount={totalCount}
        groups={environmentGroups}
        searchPlaceholder={t('home.search_placeholder')}
        emptyMessage={t('home.no_environments')}
        headerButtons={headerButtons}
        data-cy="home-endpointList"
        showGroupHeaders
      />
    </div>
  );
}

type EnvironmentRow = Environment & {
  groupName: string;
  platformName: string;
  healthLabel: string;
};

function getHealthLabel(
  env: Environment,
  sortGroupFilter: string | null
): string {
  // When a health filter is applied the server only returns environments
  // matching that filter, so we trust the filter value as the label.
  if (sortGroupFilter !== null) {
    return sortGroupFilter;
  }

  const status = resolveBaseStatus(env);
  if (env.Agent.IsOutdated && status !== 'Down') {
    return 'Outdated';
  }
  return status;
}

function resolveBaseStatus(env: Environment): string {
  if (isEdgeEnvironment(env.Type)) {
    return env.Heartbeat ? 'Heartbeat' : 'Down';
  }
  switch (env.Status) {
    case EnvironmentStatus.Up:
      return 'Up';
    case EnvironmentStatus.Down:
    case EnvironmentStatus.Provisioning:
    case EnvironmentStatus.Error:
      return 'Down';
    default:
      return 'Unknown';
  }
}

function buildGroups(
  items: EnvironmentRow[],
  sortBy: SortType,
  groupOptions: Record<string, DropdownOption[]>,
  groupDetails: Record<string, { name: string; description: string }>,
  t: TFunction
): SortableGroup<EnvironmentRow>[] {
  if (!items?.length) return [];
  const options = groupOptions[sortBy];
  const getField = GROUP_FIELD[sortBy];
  if (!options?.length || !getField) {
    return [{ key: 'all', label: t('common.all'), items }];
  }
  const itemsByKey = new Map<string, EnvironmentRow[]>();
  for (const item of items) {
    const key = getField(item);
    const bucket = itemsByKey.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      itemsByKey.set(key, [item]);
    }
  }

  return options.flatMap(({ key, label: optLabel }) => {
    const groupItems = itemsByKey.get(key);
    if (!groupItems?.length) return [];

    const label = optLabel ?? key;
    let icon: ReactNode;
    let description: string | undefined;

    if (sortBy === 'PlatformType' && platformDetails[key]) {
      icon = getPlatformIconByPlatform(platformDetails[key].type, 'md');
      description = t(platformDetails[key].descriptionKey);
    } else if (sortBy === 'Health' && healthDetails[key]) {
      icon = getHealthIcon(healthDetails[key].type, 'md');
      description = t(healthDetails[key].descriptionKey);
    } else if (sortBy === 'Group') {
      icon = getGroupIcon('md');
      description = groupDetails[key]?.description;
    }

    return [{ key, label, icon, description, items: groupItems }];
  });
}
