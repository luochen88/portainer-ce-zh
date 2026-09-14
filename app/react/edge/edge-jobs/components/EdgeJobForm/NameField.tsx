import { useTranslation } from 'react-i18next';
import { Field, FormikErrors } from 'formik';
import { string } from 'yup';
import { useMemo } from 'react';

import i18n from '@/i18n';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { useEdgeJobs } from '../../queries/useEdgeJobs';
import { EdgeJob } from '../../types';

export function NameField({ errors }: { errors?: FormikErrors<string> }) {
  const { t } = useTranslation();
  return (
    <FormControl label={t('common.name')} required errors={errors} inputId="edgejob_name">
      <Field
        as={Input}
        name="name"
        placeholder="e.g. backup-app-prod"
        data-cy="edgejob-name-input"
        id="edgejob_name"
      />
    </FormControl>
  );
}

export function useNameValidation(id?: EdgeJob['Id']) {
  const edgeJobsQuery = useEdgeJobs();

  return useMemo(
    () =>
      string()
        .required(i18n.t('validation.nameRequired'))
        .matches(
          /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/,
          i18n.t('validation.allowedCharsAlphaNumericDotDashUnderscore')
        )
        .test({
          name: 'is-unique',
          test: (value) =>
            !edgeJobsQuery.data?.find(
              (job) => job.Name === value && job.Id !== id
            ),
          message: i18n.t('validation.nameMustBeUnique'),
        }),
    [edgeJobsQuery.data, id]
  );
}
