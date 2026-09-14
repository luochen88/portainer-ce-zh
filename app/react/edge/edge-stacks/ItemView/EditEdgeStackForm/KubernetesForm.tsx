import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { SwitchField } from '@@/form-components/SwitchField';
import { WebEditorForm } from '@@/WebEditorForm';

import { DeploymentType } from '../../types';

import { FormValues } from './types';

export function KubernetesForm({
  handleContentChange,
  handleVersionChange,
  versionOptions,
}: {
  handleContentChange: (type: DeploymentType, content: string) => void;
  handleVersionChange: (version: number) => void;
  versionOptions: number[] | undefined;
}) {
  const { errors, values, setFieldValue } = useFormikContext<FormValues>();
  const { t } = useTranslation();

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label={t('edge.stacks.kube.useManifestNamespaces')}
            data-cy="use-manifest-namespaces-switch"
            tooltip={t('edge.stacks.kube.useManifestNamespacesTooltip')}
            checked={values.useManifestNamespaces}
            onChange={(value) => setFieldValue('useManifestNamespaces', value)}
          />
        </div>
      </div>

      <WebEditorForm
        data-cy="kube-manifest-editor"
        value={values.content}
        type="yaml"
        id="kube-manifest-editor"
        textTip={t('edge.stacks.kube.manifestContentTip')}
        onChange={(value) =>
          handleContentChange(DeploymentType.Kubernetes, value)
        }
        error={errors.content}
        versions={versionOptions}
        onVersionChange={handleVersionChange}
      >
        <p>
          You can get more information about Kubernetes file format in the{' '}
          <a
            href="https://kubernetes.io/docs/concepts/overview/working-with-objects/"
            target="_blank"
            rel="noreferrer"
          >
            official documentation
          </a>
          .
        </p>
      </WebEditorForm>
    </>
  );
}
