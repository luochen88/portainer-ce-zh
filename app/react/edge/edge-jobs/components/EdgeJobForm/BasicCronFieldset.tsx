import { useTranslation } from 'react-i18next';

import { useFormikContext } from 'formik';

import { SwitchField } from '@@/form-components/SwitchField';

import { FormValues } from '../../CreateView/types';

import { RecurringFieldset, defaultCronExpression } from './RecurringFieldset';
import { ScheduledDateFieldset } from './ScheduledDateFieldset';

export function BasicCronFieldset() {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<FormValues>();
  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label={t('edge.jobs.recurring.label')}
            checked={values.recurring}
            onChange={(value) => {
              setFieldValue('recurring', value);
              if (value) {
                setFieldValue('recurringOption', defaultCronExpression);
              }
            }}
            data-cy="edgeJobCreate-recurringSwitch"
          />
        </div>
      </div>
      {values.recurring ? <RecurringFieldset /> : <ScheduledDateFieldset />}
    </>
  );
}
