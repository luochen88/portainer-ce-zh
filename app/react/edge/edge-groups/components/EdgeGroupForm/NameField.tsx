import { Field, FormikErrors } from 'formik';
import { string } from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { useEdgeGroups } from '../../queries/useEdgeGroups';
import { EdgeGroup } from '../../types';

export function NameField({ errors }: { errors?: FormikErrors<string> }) {
  const { t } = useTranslation();
  return (
    <FormControl label={t('common.name')} required errors={errors} inputId="group_name">
      <Field
        as={Input}
        name="name"
        placeholder="e.g. mygroup"
        data-cy="edgeGroupCreate-groupNameInput"
        id="group_name"
      />
    </FormControl>
  );
}

export function useNameValidation(id?: EdgeGroup['Id']) {
  const edgeGroupsQuery = useEdgeGroups();

  return useMemo(
    () =>
      string()
        .required(i18n.t('validation.nameRequired'))
        .test({
          name: 'is-unique',
          test: (value) =>
            !edgeGroupsQuery.data?.find(
              (group) => group.Name === value && group.Id !== id
            ),
          message: i18n.t('validation.nameMustBeUnique'),
        }),
    [edgeGroupsQuery.data, id]
  );
}
