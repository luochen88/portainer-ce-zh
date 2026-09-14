import { StorageClass } from '@/react/portainer/environments/types';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';

import { StorageQuotaItem } from './StorageQuotaItem';

interface Props {
  storageClasses: StorageClass[];
}

export function StorageQuotaFormSection({ storageClasses }: Props) {
  const { t } = useTranslation();

  return (
    <FormSection title={t('kubernetes.volumes.storage.title')}>
      <TextTip color="blue">
        {t('kubernetes.namespaces.form.storage.tip')}
      </TextTip>

      {storageClasses.map((storageClass) => (
        <StorageQuotaItem key={storageClass.Name} storageClass={storageClass} />
      ))}
    </FormSection>
  );
}
