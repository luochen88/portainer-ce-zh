import { useTranslation } from 'react-i18next';

import { GroupBase } from 'react-select';

import {
  PortainerSelect,
  Option,
} from '@/react/components/form-components/PortainerSelect';
import { useCurrentUser } from '@/react/hooks/useUser';
import i18n from '@/i18n';
import { RegistryTypes } from '@/react/portainer/registries/types/registry';

import { FormControl } from '@@/form-components/FormControl';
import { Alert } from '@@/Alert';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export type RepoValue = {
  repoUrl?: string; // set for traditional https helm repos
  name?: string;
  type?: RegistryTypes;
};

interface Props {
  selectedRegistry: RepoValue | null;
  onRegistryChange: (registry: RepoValue | null) => void;
  namespace?: string;
  placeholder?: string;
  'data-cy'?: string;
  isRepoAvailable: boolean;
  isLoading: boolean;
  isError: boolean;
  repoOptions: GroupBase<Option<RepoValue>>[];
}

export function HelmRegistrySelect({
  selectedRegistry,
  onRegistryChange,
  namespace,
  placeholder = i18n.t('kubernetes.helm.repositories.selectRepository'),
  'data-cy': dataCy = 'helm-registry-select',
  isRepoAvailable,
  isLoading,
  isError,
  repoOptions,
}: Props) {
  const { t } = useTranslation();
  const { isPureAdmin } = useCurrentUser();

  return (
    <FormControl
      label={t('kubernetes.helm.repositories.chartSource')}
      tooltip={<HelmChartSourceTooltip isPureAdmin={isPureAdmin} />}
    >
      <PortainerSelect<RepoValue>
        placeholder={placeholder}
        value={selectedRegistry ?? {}}
        options={repoOptions}
        isLoading={isLoading}
        onChange={onRegistryChange}
        isClearable
        bindToBody
        data-cy={dataCy}
      />
      <NoReposWarning
        hasNoRepos={!isRepoAvailable}
        isLoading={isLoading}
        namespace={namespace}
        isPureAdmin={isPureAdmin}
      />
      {isError && <Alert color="error">Unable to load registry options.</Alert>}
    </FormControl>
  );
}

function HelmChartSourceTooltip({ isPureAdmin }: { isPureAdmin: boolean }) {
  if (isPureAdmin) {
    return (
      <>
        <CreateUserRepoMessage />
        <br />
        <CreateGlobalRepoMessage />
      </>
    );
  }

  // Non-admin
  return <CreateUserRepoMessage />;
}

function NoReposWarning({
  hasNoRepos,
  isLoading,
  namespace,
  isPureAdmin,
}: {
  hasNoRepos: boolean;
  isLoading: boolean;
  namespace?: string;
  isPureAdmin: boolean;
}) {
  if (!hasNoRepos || isLoading || !namespace) {
    return null;
  }

  return (
    <TextTip color="blue" className="mt-2">
      There are no repositories available.
      <CreateRepoMessage isPureAdmin={isPureAdmin} />
    </TextTip>
  );
}

function CreateRepoMessage({ isPureAdmin }: { isPureAdmin: boolean }) {
  if (isPureAdmin) {
    return (
      <>
        <CreateUserRepoMessage />
        <br />
        <CreateGlobalRepoMessage />
      </>
    );
  }

  // Non-admin
  return <CreateUserRepoMessage />;
}

function CreateUserRepoMessage() {
  return (
    <>
      You can define <b>repositories</b> in the{' '}
      <Link
        to="portainer.account"
        params={{ '#': 'helm-repositories' }}
        data-cy="helm-repositories-link"
      >
        User settings - Helm repositories
      </Link>
      .
    </>
  );
}

function CreateGlobalRepoMessage() {
  return (
    <>
      You can also define repositories in the{' '}
      <Link
        to="portainer.settings"
        params={{ '#': 'kubernetes-settings' }}
        data-cy="portainer-settings-link"
        target="_blank"
      >
        Portainer settings
      </Link>
      .
    </>
  );
}
