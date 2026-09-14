import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { object, SchemaOf, string } from 'yup';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useResizePVC } from '@/react/kubernetes/volumes/queries/useResizePVC';

import { Modal } from '@@/modals';
import { LoadingButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { PersistentVolumeClaim } from './types';

interface ResizeClaimEditFormValues {
  newSize: string;
}

interface Props {
  claim: PersistentVolumeClaim;
  onDismiss: () => void;
}

export function ResizeClaimEditForm({ claim, onDismiss }: Props) {
  const { t } = useTranslation();
  const envId = useEnvironmentId();
  const resizeMutation = useResizePVC(envId);

  const initialValues: ResizeClaimEditFormValues = {
    newSize: claim.storageRequest ?? '',
  };

  return (
    <>
      <Modal.Header title={t('kubernetes.volumes.claims.resize.title')} />

      <Formik<ResizeClaimEditFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema()}
        onSubmit={onSubmit}
        validateOnChange
      >
        {({ errors, handleSubmit, isSubmitting }) => (
          <>
            <Modal.Body>
              <Form className="form-vertical" onSubmit={handleSubmit}>
                <FormControl
                  label={t('kubernetes.volumes.claims.resize.newSizeLabel')}
                  inputId="newSize-input"
                  errors={errors.newSize}
                  size="vertical"
                >
                  <Field
                    as={Input}
                    id="newSize-input"
                    name="newSize"
                    placeholder={t('kubernetes.volumes.claims.resize.placeholder')}
                    data-cy="kubernetes-pvc-resize-size-input"
                  />
                </FormControl>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <LoadingButton
                loadingText={t('kubernetes.volumes.claims.resize.loading')}
                isLoading={isSubmitting}
                onClick={() => handleSubmit()}
                data-cy="kubernetes-pvc-resize-submit"
              >
                {t('kubernetes.volumes.claims.resize.submit')}
              </LoadingButton>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );

  async function onSubmit(values: ResizeClaimEditFormValues) {
    await resizeMutation.mutateAsync({
      namespace: claim.namespace,
      name: claim.name,
      newSize: values.newSize,
    });
    onDismiss();
  }
}

function validationSchema(): SchemaOf<ResizeClaimEditFormValues> {
  return object().shape({
    newSize: string().required('New size is required'),
  });
}
