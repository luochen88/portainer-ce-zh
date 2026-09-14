import { Box, Boxes } from 'lucide-react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { AppDataAccessPolicy } from '../types';

interface Props {
  isEdit: boolean;
  persistedFoldersUseExistingVolumes: boolean;
  value: AppDataAccessPolicy;
  onChange(value: AppDataAccessPolicy): void;
}

export function DataAccessPolicyFormSection({
  isEdit,
  persistedFoldersUseExistingVolumes,
  value,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const options = getOptions(value, isEdit, persistedFoldersUseExistingVolumes, t);

  return (
    <FormSection title={t('kubernetes.applications.create.dataAccessPolicy.title')} titleSize="sm">
      <TextTip color="blue">
        {t('kubernetes.applications.create.dataAccessPolicy.tip')}
      </TextTip>
      <BoxSelector
        slim
        options={options}
        value={value}
        onChange={onChange}
        radioName="data_access_policy"
      />
    </FormSection>
  );
}

function getOptions(
  value: AppDataAccessPolicy,
  isEdit: boolean,
  persistedFoldersUseExistingVolumes: boolean,
  t: TFunction
): ReadonlyArray<BoxSelectorOption<AppDataAccessPolicy>> {
  return [
    {
      value: 'Isolated',
      id: 'data_access_isolated',
      icon: Boxes,
      iconType: 'badge',
      label: t('kubernetes.applications.create.dataAccessPolicy.options.isolated.label'),
      description:
        t('kubernetes.applications.create.dataAccessPolicy.options.isolated.description'),
      tooltip: () =>
        isEdit || persistedFoldersUseExistingVolumes
          ? t('kubernetes.applications.create.dataAccessPolicy.changeNotAllowed')
          : '',
      disabled: () =>
        (isEdit && value !== 'Isolated') || persistedFoldersUseExistingVolumes,
    },
    {
      value: 'Shared',
      id: 'data_access_shared',
      icon: Box,
      iconType: 'badge',
      label: t('kubernetes.applications.create.dataAccessPolicy.options.shared.label'),
      description:
        t('kubernetes.applications.create.dataAccessPolicy.options.shared.description'),
      tooltip: () => {
        if (persistedFoldersUseExistingVolumes) {
          return t('kubernetes.applications.create.dataAccessPolicy.changeNotAllowed');
        }
        return '';
      },
      disabled: () => isEdit && value !== 'Shared',
    },
  ] as const;
}
