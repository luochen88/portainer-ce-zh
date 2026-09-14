import { useDockerComposeSchema } from '@/react/hooks/useDockerComposeSchema/useDockerComposeSchema';

import { InlineLoader } from '@@/InlineLoader';
import { useTranslation, Trans } from 'react-i18next';

import { WebEditorForm } from '@@/WebEditorForm';

export function DockerContentField({
  error,
  onChange,
  readonly,
  value,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readonly?: boolean;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const dockerComposeSchemaQuery = useDockerComposeSchema();

  if (isLoading || dockerComposeSchemaQuery.isInitialLoading) {
    return <InlineLoader>{t('edge.stacks.loadingContent')}</InlineLoader>;
  }

  return (
    <WebEditorForm
      id="stack-creation-editor"
      value={value}
      onChange={onChange}
      type="yaml"
      textTip={t('edge.stacks.compose.contentTip')}
      error={error}
      readonly={readonly}
      schema={dockerComposeSchemaQuery.data}
      data-cy="stack-creation-editor"
    >
      <Trans i18nKey="edge.stacks.compose.documentation" components={{ 1: <a href="https://docs.docker.com/reference/compose-file/" target="_blank" rel="noreferrer" /> }} />
    </WebEditorForm>
  );
}
