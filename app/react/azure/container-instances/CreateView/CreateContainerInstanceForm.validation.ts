import { object, string, number, boolean, array } from 'yup';

import i18n from '@/i18n';

import { validationSchema as accessControlSchema } from '@/react/portainer/access-control/AccessControlForm/AccessControlForm.validation';

import { buildUniquenessTest } from '@@/form-components/validate-unique';

import { validationSchema as portsSchema } from './PortsMappingField.validation';

export function validationSchema(isAdmin: boolean) {
  return object().shape({
    name: string().required(i18n.t('azure.containerInstances.validation.nameRequired')),
    image: string().required(i18n.t('azure.containerInstances.validation.imageRequired')),
    subscription: string().required(i18n.t('azure.containerInstances.validation.subscriptionRequired')),
    resourceGroup: string().required(i18n.t('azure.containerInstances.validation.resourceGroupRequired')),
    location: string().required(i18n.t('azure.containerInstances.validation.locationRequired')),
    os: string().oneOf(['Linux', 'Windows']),
    cpu: number().positive(),
    memory: number().positive(),
    allocatePublicIP: boolean(),
    ports: portsSchema(),
    accessControl: accessControlSchema(isAdmin),
    env: array()
      .of(
        object().shape({
          name: string().required(i18n.t('azure.containerInstances.validation.envNameRequired')),
          value: string().required(i18n.t('azure.containerInstances.validation.envValueRequired')),
        })
      )
      .test(
        'unique',
        i18n.t('azure.containerInstances.validation.envAlreadyDefined'),
        buildUniquenessTest(
          () => i18n.t('azure.containerInstances.validation.envAlreadyDefined'),
          'name'
        )
      ),
  });
}
