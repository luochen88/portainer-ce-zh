import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

import { FormikErrors } from 'formik';
import { SchemaOf, string } from 'yup';
import { useMemo } from 'react';

import { STACK_NAME_VALIDATION_REGEX } from '@/react/constants';
import { EnvironmentType } from '@/react/portainer/environments/types';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { EdgeStack } from '../types';
import { useEdgeStacks } from '../queries/useEdgeStacks';
import { useEdgeGroups } from '../../edge-groups/queries/useEdgeGroups';
import { EdgeGroup } from '../../edge-groups/types';

export function NameField({
  onChange,
  value,
  errors,
  placeholder,
}: {
  onChange(value: string): void;
  value: string;
  errors?: FormikErrors<string>;
  placeholder?: string;
}) {
  const { t } = useTranslation();

  return (
    <FormControl inputId="name-input" label={t('common.name')} errors={errors} required>
      <Input
        id="name-input"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
        required
        data-cy="edgeStackCreate-nameInput"
      />
    </FormControl>
  );
}

export function nameValidation(
  stacks: Array<EdgeStack>,
  isComposeStack: boolean | undefined
): SchemaOf<string> {
  let schema = string()
    .required(i18n.t('validation.nameRequired'))
    .test('unique', i18n.t('validation.nameMustBeUnique'), (value) =>
      stacks.every((s) => s.Name !== value)
    );

  if (isComposeStack) {
    schema = schema.matches(
      new RegExp(STACK_NAME_VALIDATION_REGEX),
      i18n.t('edge.stacks.validation.nameFormat')
    );
  }

  return schema;
}

export function useNameValidation() {
  const edgeStacksQuery = useEdgeStacks();
  const edgeGroupsQuery = useEdgeGroups({
    select: (groups) =>
      Object.fromEntries(groups.map((g) => [g.Id, g.EndpointTypes])),
  });
  const edgeGroupsType = edgeGroupsQuery.data;

  return useMemo(
    () => (groupIds: Array<EdgeGroup['Id']>) =>
      nameValidation(
        edgeStacksQuery.data || [],
        groupIds
          .flatMap((g) => edgeGroupsType?.[g])
          ?.includes(EnvironmentType.EdgeAgentOnDocker)
      ),
    [edgeGroupsType, edgeStacksQuery.data]
  );
}
