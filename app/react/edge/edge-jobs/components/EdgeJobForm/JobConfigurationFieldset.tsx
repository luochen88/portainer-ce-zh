import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

import { useFormikContext } from 'formik';
import { Calendar, Edit } from 'lucide-react';

import { FormSection } from '@@/form-components/FormSection';
import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';

import { FormValues } from '../../CreateView/types';

import { AdvancedCronFieldset } from './AdvancedCronFieldset';
import { BasicCronFieldset } from './BasicCronFieldset';

export const cronMethodOptions: ReadonlyArray<BoxSelectorOption<string>> = [
  {
    id: 'config_basic',
    value: 'basic',
    icon: Calendar,
    iconType: 'badge',
    label: i18n.t('edge.jobs.configuration.basic'),
    description: i18n.t('edge.jobs.configuration.basicDescription'),
  },
  {
    id: 'config_advanced',
    value: 'advanced',
    icon: Edit,
    iconType: 'badge',
    label: i18n.t('edge.jobs.configuration.advanced'),
    description: i18n.t('edge.jobs.configuration.advancedDescription'),
  },
] as const;

export function JobConfigurationFieldset() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <>
      <FormSection title={t('edge.jobs.configuration.title')}>
        <BoxSelector
          slim
          radioName="configuration"
          value={values.cronMethod}
          options={cronMethodOptions}
          onChange={(value) => {
            setFieldValue('cronMethod', value);
            setFieldValue('cronExpression', '');
          }}
        />
      </FormSection>

      {values.cronMethod === 'basic' ? (
        <BasicCronFieldset />
      ) : (
        <AdvancedCronFieldset />
      )}
    </>
  );
}
