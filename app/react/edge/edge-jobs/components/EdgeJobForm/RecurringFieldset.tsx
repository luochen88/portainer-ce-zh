import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import i18n from '@/i18n';


import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

export const defaultCronExpression = '0 * * * *' as const;

export const timeOptions = [
  {
    label: i18n.t('edge.jobs.recurring.everyHour'),
    value: defaultCronExpression,
  },
  {
    label: i18n.t('edge.jobs.recurring.every2Hours'),
    value: '0 */2 * * *',
  },
  {
    label: i18n.t('edge.jobs.recurring.everyDay'),
    value: '0 0 * * *',
  },
] as const;

export function RecurringFieldset() {
  const [{ value, onChange, name, onBlur }, { error }] =
    useField<string>('recurringOption');

  const { t } = useTranslation();
  return (
    <FormControl label={t('edge.jobs.recurring.time')} inputId="edge_job_value" errors={error}>
      <Select
        id="edge_job_value"
        data-cy="edge-job-time-select"
        name={name}
        options={timeOptions}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormControl>
  );
}
