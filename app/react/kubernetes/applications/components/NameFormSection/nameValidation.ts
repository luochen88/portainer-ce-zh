import { SchemaOf, string as yupString } from 'yup';

import i18n from '@/i18n';

type ValidationData = {
  existingNames: string[];
  isEdit: boolean;
  originalName?: string;
};

export function appNameValidation(
  validationData?: ValidationData
): SchemaOf<string> {
  return yupString()
    .required(i18n.t('kubernetes.common.validation.required'))
    .test(
      'is-unique',
      i18n.t('kubernetes.applications.form.name.validation.duplicate'),
      (appName) => {
        if (!validationData || !appName) {
          return true;
        }
        // if creating, check if the name is unique
        if (!validationData.isEdit) {
          return !validationData.existingNames.includes(appName);
        }
        // if editing, the original name will be in the list of existing names
        // remove it before checking if the name is unique
        const updatedExistingNames = validationData.existingNames.filter(
          (name) => name !== validationData.originalName
        );
        return !updatedExistingNames.includes(appName);
      }
    )
    .test(
      'is-valid',
      i18n.t('kubernetes.applications.form.name.validation.invalid'),
      (appName) => {
        if (!appName) {
          return true;
        }
        return /^[a-z]([a-z0-9-]{0,61}[a-z0-9])?$/g.test(appName);
      }
    );
}
