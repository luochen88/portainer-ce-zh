import { array, object, string } from 'yup';

import i18n from '@/i18n';

export function validationSchema() {
  return array(
    object().shape({
      host: string().required(i18n.t('azure.containerInstances.ports.validation.hostRequired')),
      container: string().required(i18n.t('azure.containerInstances.ports.validation.containerRequired')),
      protocol: string().oneOf(['TCP', 'UDP']),
    })
  ).min(1, i18n.t('azure.containerInstances.ports.validation.atLeastOne'));
}
