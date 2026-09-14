import { components, MultiValueGenericProps } from 'react-select';
import { useTranslation } from 'react-i18next';

import { Select } from '@@/form-components/ReactSelect';

interface Option {
  Name: string;
  Description: string;
}

interface Props {
  value: Option[];
  onChange(value: readonly Option[]): void;
  options: Option[];
  inputId?: string;
  storageClassName: string;
}

export function StorageAccessModeSelector({
  value,
  onChange,
  options,
  inputId,
  storageClassName,
}: Props) {
  const { t } = useTranslation();
  return (
    <Select
      isMulti
      getOptionLabel={(option) => option.Description}
      getOptionValue={(option) => option.Name}
      components={{ MultiValueLabel }}
      options={options}
      value={value}
      closeMenuOnSelect={false}
      onChange={(value) => onChange(value)}
      inputId={inputId}
      placeholder={t('kubernetes.common.notConfigured')}
      data-cy={`kubeSetup-storageAccessSelect${storageClassName}`}
      id={`kubeSetup-storageAccessSelect${storageClassName}`}
    />
  );
}

function MultiValueLabel({
  data,
  innerProps,
  selectProps,
}: MultiValueGenericProps<Option>) {
  if (!data || !data.Name) {
    throw new Error('missing option name');
  }

  return (
    <components.MultiValueLabel
      data={data}
      innerProps={innerProps}
      selectProps={selectProps}
    >
      {data.Name}
    </components.MultiValueLabel>
  );
}
