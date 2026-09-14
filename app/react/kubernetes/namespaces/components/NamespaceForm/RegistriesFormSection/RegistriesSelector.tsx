import { MultiValue } from 'react-select';
import { useTranslation } from 'react-i18next';

import { Registry } from '@/react/portainer/registries/types/registry';
import { useCurrentUser } from '@/react/hooks/useUser';

import { Select } from '@@/form-components/ReactSelect';
import { Link } from '@@/Link';

interface Props {
  value: MultiValue<Registry>;
  onChange(value: MultiValue<Registry>): void;
  options?: Registry[];
  inputId?: string;
  isEditingDisabled?: boolean;
}

export function RegistriesSelector({
  value,
  onChange,
  options = [],
  inputId,
  isEditingDisabled,
}: Props) {
  const { t } = useTranslation();
  const { isPureAdmin } = useCurrentUser();

  if (options.length === 0) {
    return (
      <p className="text-muted mb-1 mt-2 text-xs">
        {isPureAdmin ? (
          <span>
            <Trans
              i18nKey="kubernetes.namespaces.form.registries.noRegistriesAdmin"
              components={{
                registryLink: (
                  <Link
                    to="portainer.registries"
                    target="_blank"
                    data-cy="namespace-permissions-registries-selector"
                  />
                ),
              }}
            />
          </span>
        ) : (
          <span>
            {t('kubernetes.namespaces.form.registries.noRegistriesUser')}
          </span>
        )}
      </p>
    );
  }

  if (isEditingDisabled) {
    return (
      <p className="text-muted mb-1 mt-2 text-xs">
        {
          value.length === 0
            ? t('kubernetes.common.none')
            : value.map((v) => v.Name).join(', ')
        }
      </p>
    );
  }

  return (
    <Select
      isMulti
      getOptionLabel={(option) => option.Name}
      getOptionValue={(option) => String(option.Id)}
      options={options}
      value={value}
      closeMenuOnSelect={false}
      onChange={onChange}
      inputId={inputId}
      data-cy="namespaceCreate-registrySelect"
      id="namespaceCreate-registrySelect"
      placeholder={t('kubernetes.namespaces.form.registries.placeholder')}
      isDisabled={isEditingDisabled}
    />
  );
}
