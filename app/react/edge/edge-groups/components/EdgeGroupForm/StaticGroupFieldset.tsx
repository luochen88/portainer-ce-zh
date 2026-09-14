import { useTranslation } from 'react-i18next';

import { useFormikContext } from 'formik';

import { AssociatedEdgeGroupEnvironmentsSelector } from '@/react/edge/components/AssociatedEdgeGroupEnvironmentsSelector';

import { FormSection } from '@@/form-components/FormSection';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

import { FormValues } from './types';

export function StaticGroupFieldset({ isEdit }: { isEdit?: boolean }) {
  const { t } = useTranslation();
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  return (
    <FormSection title={t('edge.associatedEnvironments')}>
      <div className="form-group">
        <AssociatedEdgeGroupEnvironmentsSelector
          value={values.environmentIds}
          error={errors.environmentIds}
          onChange={async (environmentIds, meta) => {
            if (meta.type === 'remove' && isEdit) {
              const confirmed = await confirmDestructive({
                title: t('common.confirmAction'),
                message:
                  t('edge.groups.confirmRemoveEnvironment'),
                confirmButton: buildConfirmButton(t('common.confirm')),
              });

              if (!confirmed) {
                return;
              }
            }

            setFieldValue('environmentIds', environmentIds);
          }}
          edgeGroupId={values.edgeGroupId}
        />
      </div>
    </FormSection>
  );
}
