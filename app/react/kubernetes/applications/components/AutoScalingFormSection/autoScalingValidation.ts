import { SchemaOf, boolean, number, object } from 'yup';

import i18n from '@/i18n';

import { nanNumberSchema } from '@/react-tools/yup-schemas';

import { AutoScalingFormValues } from './types';

type ValidationData = {
  autoScalerOverflow: boolean;
};

export function autoScalingValidation(
  validationData?: ValidationData
): SchemaOf<AutoScalingFormValues> {
  const { autoScalerOverflow } = validationData || {};
  return object({
    isUsed: boolean().required(),
    minReplicas: number().when('isUsed', (isUsed: boolean) =>
      isUsed
        ? nanNumberSchema(i18n.t('kubernetes.applications.form.autoscaling.validation.minInstancesRequired'))
            .required(i18n.t('kubernetes.applications.form.autoscaling.validation.minInstancesRequired'))
            .min(1, i18n.t('kubernetes.applications.form.autoscaling.validation.minInstancesGreaterThanZero'))
            .test(
              'maxReplicas',
              i18n.t('kubernetes.applications.form.autoscaling.validation.minLessThanMax'),
              // eslint-disable-next-line func-names
              function (this, value?: number): boolean {
                if (!value) {
                  return true;
                }
                const { maxReplicas } = this.parent as AutoScalingFormValues;
                return !maxReplicas || value < maxReplicas;
              }
            )
        : number()
    ),
    maxReplicas: number().when('isUsed', (isUsed: boolean) =>
      isUsed
        ? nanNumberSchema(i18n.t('kubernetes.applications.form.autoscaling.validation.maxInstancesRequired'))
            .required(i18n.t('kubernetes.applications.form.autoscaling.validation.maxInstancesRequired'))
            .test(
              'minReplicas',
              i18n.t('kubernetes.applications.form.autoscaling.validation.maxGreaterThanMin'),
              // eslint-disable-next-line func-names
              function (this, value?: number): boolean {
                if (!value) {
                  return false;
                }
                const { minReplicas } = this.parent as AutoScalingFormValues;
                return !minReplicas || value > minReplicas;
              }
            )
            .test(
              'overflow',
              i18n.t('kubernetes.applications.form.autoscaling.validation.resourceOverflow'),
              () => !autoScalerOverflow
            )
        : number()
    ),
    targetCpuUtilizationPercentage: number().when(
      'isUsed',
      (isUsed: boolean) =>
        isUsed
          ? nanNumberSchema(i18n.t('kubernetes.applications.form.autoscaling.validation.targetCpuRequired'))
              .min(0, i18n.t('kubernetes.applications.form.autoscaling.validation.targetCpuGreaterThanZero'))
              .max(100, i18n.t('kubernetes.applications.form.autoscaling.validation.targetCpuSmallerThan100'))
              .required(i18n.t('kubernetes.applications.form.autoscaling.validation.targetCpuRequired'))
          : number()
    ),
  });
}
