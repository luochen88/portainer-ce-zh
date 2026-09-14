import { SchemaOf, array, boolean, number, object } from 'yup';
import { useMemo } from 'react';

import i18n from '@/i18n';

import { EdgeGroup } from '../../types';

import { FormValues } from './types';
import { useNameValidation } from './NameField';

export function useValidation({
  id,
}: { id?: EdgeGroup['Id'] } = {}): SchemaOf<FormValues> {
  const nameValidation = useNameValidation(id);
  return useMemo(
    () =>
      object({
        name: nameValidation,
        dynamic: boolean().default(false),
        environmentIds: array(number().required()),
        partialMatch: boolean().default(false),
        tagIds: array(number().required()).when('dynamic', {
          is: true,
          then: (schema) => schema.min(1, i18n.t('edge.groups.validation.tagsRequired')),
        }),
        edgeGroupId: number().default(0).notRequired(),
      }),
    [nameValidation]
  );
}
