import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { DateTimeField } from '@@/DateTimeField';

import { TimeTip } from './TimeTip';

export function ScheduledDateFieldset() {
  const [{ value }, { error }, { setValue }] = useField<Date | null>(
    'dateTime'
  );
  const { t } = useTranslation();
  return (
    <>
      <DateTimeField
        value={value}
        onChange={(date) => setValue(date)}
        error={error}
        label={t('edge.jobs.scheduledDate')}
        name="dateTime"
        data-cy="edge-job-date-time-picker"
      />

      <TimeTip />
    </>
  );
}
