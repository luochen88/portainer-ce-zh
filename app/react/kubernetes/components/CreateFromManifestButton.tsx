import { useCurrentStateAndParams } from '@uirouter/react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AutomationTestingProps } from '@/types';

import { MenuButton, MenuButtonLink } from '@@/buttons/MenuButton';
import { Icon } from '@@/Icon';

export function CreateFromManifestButton({
  params = {},
  'data-cy': dataCy,
}: { params?: object } & AutomationTestingProps) {
  const { state } = useCurrentStateAndParams();
  const { t } = useTranslation();
  return (
    <MenuButton
      items={[
        <MenuButtonLink
          key="manifest"
          to="kubernetes.deploy"
          params={{
            referrer: state.name,
            ...params,
          }}
          label={t('kubernetes.common.createFromManifest.createFromManifest')}
          data-cy={`${dataCy}-manifest`}
        >
          {t('kubernetes.common.createFromManifest.manifest')}
        </MenuButtonLink>,
        <MenuButtonLink
          key="helm"
          to="kubernetes.helminstall"
          params={{
            referrer: state.name,
            ...params,
          }}
          label={t('kubernetes.common.createFromManifest.createFromHelmChart')}
          data-cy={`${dataCy}-helm`}
        >
          {t('kubernetes.common.createFromManifest.helmChart')}
        </MenuButtonLink>,
      ]}
      data-cy={dataCy}
    >
      <Icon icon={Plus} size="xs" />
      {t('kubernetes.common.createFromManifest.createFromCode')}
    </MenuButton>
  );
}
