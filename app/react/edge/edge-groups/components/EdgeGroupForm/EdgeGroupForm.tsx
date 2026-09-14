import { Form, Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@@/form-components/FormSection';
import { BoxSelector } from '@@/BoxSelector';
import { FormActions } from '@@/form-components/FormActions';

import { EdgeGroup } from '../../types';

import { groupTypeOptions } from './group-type-options';
import { FormValues } from './types';
import { useValidation } from './useValidation';
import { DynamicGroupFieldset } from './DynamicGroupFieldset';
import { StaticGroupFieldset } from './StaticGroupFieldset';
import { NameField } from './NameField';

export function EdgeGroupForm({
  onSubmit,
  isLoading,
  group,
}: {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  group?: EdgeGroup;
}) {
  const validation = useValidation({ id: group?.Id });
  return (
    <Formik
      validationSchema={validation}
      validateOnMount
      initialValues={
        group
          ? {
              dynamic: group.Dynamic,
              environmentIds: group.Endpoints,
              name: group.Name,
              partialMatch: group.PartialMatch,
              tagIds: group.TagIds,
              edgeGroupId: group.Id,
            }
          : {
              name: '',
              dynamic: false,
              environmentIds: [],
              partialMatch: false,
              tagIds: [],
              edgeGroupId: 0,
            }
      }
      onSubmit={onSubmit}
    >
      <InnerForm isLoading={isLoading} isCreate={!group} />
    </Formik>
  );
}

function InnerForm({
  isLoading,
  isCreate,
}: {
  isLoading: boolean;
  isCreate: boolean;
}) {
  const { t } = useTranslation();
  const { values, setFieldValue, isValid, errors } =
    useFormikContext<FormValues>();

  return (
    <Form className="form-horizontal">
      <NameField errors={errors.name} />

      <FormSection title={t('edge.groups.form.groupType')}>
        <BoxSelector
          slim
          value={values.dynamic}
          onChange={(dynamic) => setFieldValue('dynamic', dynamic)}
          options={groupTypeOptions}
          radioName="groupTypeDynamic"
        />
      </FormSection>

      {values.dynamic ? <DynamicGroupFieldset /> : <StaticGroupFieldset />}

      <FormActions
        submitLabel={isCreate ? t('edge.groups.add') : t('edge.groups.save')}
        isLoading={isLoading}
        isValid={isValid}
        data-cy="edgeGroupCreate-addGroupButton"
        loadingText={t('common.inProgress')}
        errors={errors}
      />
    </Form>
  );
}
