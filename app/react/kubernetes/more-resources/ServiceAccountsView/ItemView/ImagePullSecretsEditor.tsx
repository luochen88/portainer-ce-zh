import { Button } from '@@/buttons/Button';
import { LoadingButton } from '@@/buttons/LoadingButton';
import {
  DisabledMultiValue,
  DisabledMultiValueRemove,
  DisabledOption,
  preserveProtectedValues,
} from '@@/form-components/DisabledMultiValue';
import { MultiSelect } from '@@/form-components/PortainerSelect';
import { useTranslation } from 'react-i18next';

type Props = {
  selectedNames: string[];
  secretOptions: DisabledOption<string>[];
  protectedSecretNames: string[];
  isSaving: boolean;
  onChange: (names: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ImagePullSecretsEditor({
  selectedNames,
  secretOptions,
  protectedSecretNames,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <MultiSelect<string>
        value={selectedNames}
        options={secretOptions}
        onChange={(names) =>
          // Registry access owns some default service account secrets, so this
          // editor keeps them selected even if the user clears the field.
          onChange(preserveProtectedValues(names, protectedSecretNames))
        }
        placeholder={t('kubernetes.moreResources.serviceAccounts.imagePullSecrets.selectPlaceholder')}
        disabled={isSaving}
        data-cy="k8sSADetail-imagePullSecrets-select"
        components={{
          MultiValue: DisabledMultiValue,
          MultiValueRemove: DisabledMultiValueRemove,
        }}
      />
      <div className="inline-flex gap-2">
        <LoadingButton
          size="small"
          isLoading={isSaving}
          loadingText={t('kubernetes.common.actions.saving')}
          onClick={onSave}
          data-cy="k8sSADetail-imagePullSecrets-save"
          className="h-[34px]"
        >
          {t('kubernetes.common.actions.save')}
        </LoadingButton>
        <Button
          size="small"
          color="default"
          disabled={isSaving}
          onClick={onCancel}
          data-cy="k8sSADetail-imagePullSecrets-cancel"
          className="h-[34px]"
        >
          {t('kubernetes.common.actions.cancel')}
        </Button>
      </div>
    </div>
  );
}
