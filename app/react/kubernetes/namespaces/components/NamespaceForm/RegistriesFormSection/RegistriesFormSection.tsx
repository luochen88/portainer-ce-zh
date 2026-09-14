import { FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import { MultiValue } from 'react-select';

import { Registry } from '@/react/portainer/registries/types/registry';
import { useEnvironmentRegistries } from '@/react/portainer/environments/queries/useEnvironmentRegistries';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { InlineLoader } from '@@/InlineLoader';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { RegistriesSelector } from './RegistriesSelector';

type Props = {
  values: MultiValue<Registry>;
  onChange: (value: MultiValue<Registry>) => void;
  errors?: string | string[] | FormikErrors<Registry>[];
  isEditingDisabled: boolean;
};

export function RegistriesFormSection({
  values,
  onChange,
  errors,
  isEditingDisabled,
}: Props) {
  const { t } = useTranslation();
  const environmentId = useEnvironmentId();
  const registriesQuery = useEnvironmentRegistries(environmentId, {
    hideDefault: true,
  });
  return (
    <FormSection title={t('kubernetes.namespaces.form.registries.title')}>
      {!isEditingDisabled && (
        <TextTip color="blue" className="mb-2">
          {t('kubernetes.namespaces.form.registries.tip')}
        </TextTip>
      )}
      <FormControl
        inputId="registries"
        label={
          isEditingDisabled
            ? t('kubernetes.namespaces.form.registries.selectedLabel')
            : t('kubernetes.namespaces.form.registries.selectLabel')
        }
        errors={errors}
      >
        {registriesQuery.isLoading && (
          <InlineLoader>
            {t('kubernetes.namespaces.form.registries.loading')}
          </InlineLoader>
        )}
        {registriesQuery.data && (
          <RegistriesSelector
            value={values}
            onChange={(registries) => onChange(registries)}
            options={registriesQuery.data}
            inputId="registries"
            isEditingDisabled={isEditingDisabled}
          />
        )}
      </FormControl>
    </FormSection>
  );
}
