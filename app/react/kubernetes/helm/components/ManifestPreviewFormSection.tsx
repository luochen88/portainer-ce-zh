import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDebouncedValue } from '@/react/hooks/useDebouncedValue';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { ExpandableMessageByLines } from '@@/ExpandableMessageByLines';
import { FormSection } from '@@/form-components/FormSection';
import { CodeEditor } from '@@/CodeEditor';
import { DiffViewer } from '@@/CodeEditor/DiffViewer';
import { InlineLoader } from '@@/InlineLoader';
import { Alert } from '@@/Alert';
import { TextTip } from '@@/Tip/TextTip';
import { Badge } from '@@/Badge';
import { Icon } from '@@/Icon';

import { useHelmDryRun } from '../helmReleaseQueries/useHelmDryRun';
import { UpdateHelmReleasePayload } from '../types';

type Props = {
  payload: UpdateHelmReleasePayload;
  onChangePreviewValidation: (isValid: boolean) => void;
  currentManifest?: string; // only true on upgrade, not install
  title: string;
  environmentId: EnvironmentId;
};

export function ManifestPreviewFormSection({
  payload,
  currentManifest,
  onChangePreviewValidation,
  title,
  environmentId,
}: Props) {
  const { t } = useTranslation();
  const debouncedPayload = useDebouncedValue(payload, 500);
  const manifestPreviewQuery = useHelmDryRun(environmentId, debouncedPayload);
  const [isFolded, setIsFolded] = useState(true);

  useEffect(() => {
    onChangePreviewValidation(!manifestPreviewQuery.isError);
  }, [manifestPreviewQuery.isError, onChangePreviewValidation]);

  if (
    !debouncedPayload.name ||
    !debouncedPayload.namespace ||
    !debouncedPayload.chart
  ) {
    return null;
  }

  // only show loading state or the error to keep the view simple (omitting the preview section because there is nothing to preview)
  if (manifestPreviewQuery.isInitialLoading) {
    return <InlineLoader>{t('kubernetes.helm.manifestPreview.generating')}</InlineLoader>;
  }

  return (
    <FormSection
      title={
        <>
          {title}
          {manifestPreviewQuery.isError && (
            <Badge
              type="dangerSecondary"
              className="ml-2"
              data-cy="helm-manifest-preview-error-badge"
            >
              <Icon icon={AlertTriangle} size="md" />
            </Badge>
          )}
        </>
      }
      isFoldable
      defaultFolded={isFolded}
      setIsDefaultFolded={setIsFolded}
    >
      {manifestPreviewQuery.isError ? (
        <Alert color="error" title={t('kubernetes.helm.manifestPreview.configurationError')}>
          <ExpandableMessageByLines>
            {manifestPreviewQuery.error?.message ||
              t('kubernetes.helm.manifestPreview.generationError')}
          </ExpandableMessageByLines>
        </Alert>
      ) : (
        <ManifestPreview
          currentManifest={currentManifest}
          newManifest={manifestPreviewQuery.data?.manifest ?? ''}
        />
      )}
    </FormSection>
  );
}

function ManifestPreview({
  currentManifest,
  newManifest,
}: {
  currentManifest?: string;
  newManifest: string;
}) {
  const { t } = useTranslation();
  if (!newManifest) {
    return <TextTip color="blue">{t('kubernetes.helm.manifestPreview.empty')}</TextTip>;
  }

  if (currentManifest) {
    return (
      <DiffViewer
        originalCode={currentManifest}
        newCode={newManifest}
        id="manifest-preview"
        data-cy="manifest-diff-preview"
        type="yaml"
      />
    );
  }

  return (
    <CodeEditor
      id="manifest-preview"
      value={newManifest}
      data-cy="manifest-preview"
      type="yaml"
      readonly
      showToolbar={false}
    />
  );
}
