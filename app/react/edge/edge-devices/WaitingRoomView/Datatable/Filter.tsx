import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

import { HomepageFilter } from '@/react/portainer/HomeView/EnvironmentList/HomepageFilter';
import { useGroups } from '@/react/portainer/environments/environment-groups/queries';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';
import { useTags } from '@/portainer/tags/queries';

import { PortainerSelect } from '@@/form-components/PortainerSelect';

import { useFilterStore } from './filter-store';

const checkInOptions = [
  { value: 0, label: i18n.t('edge.waitingRoom.filters.allTime') },
  { value: 60 * 60, label: i18n.t('edge.waitingRoom.filters.pastHour') },
  { value: 60 * 60 * 24, label: i18n.t('edge.waitingRoom.filters.pastDay') },
  { value: 60 * 60 * 24 * 7, label: i18n.t('edge.waitingRoom.filters.pastWeek') },
  { value: 60 * 60 * 24 * 14, label: i18n.t('edge.waitingRoom.filters.past14Days') },
];

export function Filter() {
  const { t } = useTranslation();
  const edgeGroupsQuery = useEdgeGroups();
  const groupsQuery = useGroups();
  const tagsQuery = useTags();

  const filterStore = useFilterStore();

  if (!edgeGroupsQuery.data || !groupsQuery.data || !tagsQuery.data) {
    return null;
  }

  return (
    <div className="flex w-full gap-5 [&>*]:w-1/5">
      <HomepageFilter
        onChange={(f) => filterStore.setEdgeGroups(f)}
        placeHolder={t('edge.groups.title')}
        value={filterStore.edgeGroups}
        filterOptions={edgeGroupsQuery.data.map((g) => ({
          label: g.Name,
          value: g.Id,
        }))}
      />
      <HomepageFilter
        onChange={(f) => filterStore.setGroups(f)}
        placeHolder={t('common.group')}
        value={filterStore.groups}
        filterOptions={groupsQuery.data.map((g) => ({
          label: g.Name,
          value: g.Id,
        }))}
      />
      <HomepageFilter
        onChange={(f) => filterStore.setTags(f)}
        placeHolder={t('common.tags')}
        value={filterStore.tags}
        filterOptions={tagsQuery.data.map((g) => ({
          label: g.Name,
          value: g.ID,
        }))}
      />

      <div className="ml-auto" />
      <PortainerSelect
        onChange={(f) => filterStore.setCheckIn(f || 0)}
        value={filterStore.checkIn}
        options={checkInOptions}
        bindToBody
        data-cy="edge-devices-check-in-filter"
      />
    </div>
  );
}
