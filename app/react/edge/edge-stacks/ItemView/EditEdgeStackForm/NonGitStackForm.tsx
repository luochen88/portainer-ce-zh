import { useTranslation } from 'react-i18next';

import { Form, Formik, useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import { array, boolean, number, object, SchemaOf, string } from 'yup';
import { useRouter } from '@uirouter/react';
import _ from 'lodash';

import { EdgeGroupsSelector } from '@/react/edge/edge-stacks/components/EdgeGroupsSelector';
import { EdgeStackDeploymentTypeSelector } from '@/react/edge/edge-stacks/components/EdgeStackDeploymentTypeSelector';
import {
  DeploymentType,
  EdgeStack,
  StaggerOption,
} from '@/react/edge/edge-stacks/types';
import { EnvironmentType } from '@/react/portainer/environments/types';
import { WebhookSettings } from '@/react/portainer/gitops/AutoUpdateFieldset/WebhookSettings';
import {
  baseEdgeStackWebhookUrl,
  createWebhookId,
} from '@/portainer/helpers/webhookHelper';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import i18n from '@/i18n';

import { notifySuccess } from '@/portainer/services/notifications';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { SwitchField } from '@@/form-components/SwitchField';
import { LoadingButton } from '@@/buttons';
import { FormError } from '@@/form-components/FormError';
import {
  EnvironmentVariablesPanel,
  envVarValidation,
} from '@@/form-components/EnvironmentVariablesFieldset';
import { usePreventExit } from '@@/WebEditorForm';

import {
  getEdgeStackFile,
  useEdgeStackFile,
} from '../../queries/useEdgeStackFile';
import {
  StaggerFieldset,
  staggerConfigValidation,
} from '../../components/StaggerFieldset';
import { RetryDeployToggle } from '../../components/RetryDeployToggle';
import { PrePullToggle } from '../../components/PrePullToggle';
import { getDefaultStaggerConfig } from '../../components/StaggerFieldset.types';

import { PrivateRegistryFieldsetWrapper } from './PrivateRegistryFieldsetWrapper';
import { FormValues } from './types';
import { useEdgeGroupHasType } from './useEdgeGroupHasType';
import { useStaggerUpdateStatus } from './useStaggerUpdateStatus';
import { useUpdateEdgeStackMutation } from './useUpdateEdgeStackMutation';
import { ComposeForm } from './ComposeForm';
import { KubernetesForm } from './KubernetesForm';
import { useAllowKubeToSelectCompose } from './useAllowKubeToSelectCompose';

const forms = {
  [DeploymentType.Compose]: ComposeForm,
  [DeploymentType.Kubernetes]: KubernetesForm,
};

export function NonGitStackForm({ edgeStack }: { edgeStack: EdgeStack }) {
  const { t } = useTranslation();
  const mutation = useUpdateEdgeStackMutation();
  const fileQuery = useEdgeStackFile(edgeStack.Id, { skipErrors: true });
  const allowKubeToSelectCompose = useAllowKubeToSelectCompose(edgeStack);
  const router = useRouter();
  const [webhookId] = useState(() => edgeStack.Webhook || createWebhookId());

  if (!fileQuery.isSuccess) {
    return null;
  }

  const fileContent = fileQuery.data || '';

  const formValues: FormValues = {
    edgeGroups: edgeStack.EdgeGroups,
    deploymentType: edgeStack.DeploymentType,
    privateRegistryId: edgeStack.Registries?.[0],
    content: fileContent,
    useManifestNamespaces: edgeStack.UseManifestNamespaces,
    prePullImage: edgeStack.PrePullImage ?? false,
    retryDeploy: edgeStack.RetryDeploy ?? false,
    webhookEnabled: !!edgeStack.Webhook,
    envVars: edgeStack.EnvVars || [],
    rollbackTo: undefined,
    staggerConfig: edgeStack.StaggerConfig || getDefaultStaggerConfig(),
  };

  const versionOptions = getVersions(edgeStack);

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSubmit}
      validationSchema={formValidation()}
    >
      <InnerForm
        edgeStack={edgeStack}
        isLoading={mutation.isLoading}
        allowKubeToSelectCompose={allowKubeToSelectCompose}
        versionOptions={versionOptions}
        isSaved={mutation.isSuccess}
      />
    </Formik>
  );

  async function handleSubmit(values: FormValues) {
    let rePullImage = false;
    if (isBE && values.deploymentType === DeploymentType.Compose) {
      const defaultToggle = values.prePullImage;
      const result = await confirmStackUpdate(
        t('edge.stacks.confirmForceUpdate'),
        defaultToggle
      );
      if (!result) {
        return;
      }

      rePullImage = result.repullImageAndRedeploy;
    }

    const updateVersion = !!(
      fileContent !== values.content ||
      values.privateRegistryId !== edgeStack.Registries?.[0] ||
      values.useManifestNamespaces !== edgeStack.UseManifestNamespaces ||
      values.prePullImage !== edgeStack.PrePullImage ||
      values.retryDeploy !== edgeStack.RetryDeploy ||
      !edgeStack.EnvVars ||
      _.differenceWith(values.envVars, edgeStack.EnvVars, _.isEqual).length >
        0 ||
      rePullImage
    );

    mutation.mutate(
      {
        id: edgeStack.Id,
        stackFileContent: values.content,
        edgeGroups: values.edgeGroups,
        deploymentType: values.deploymentType,
        registries: values.privateRegistryId ? [values.privateRegistryId] : [],
        useManifestNamespaces: values.useManifestNamespaces,
        prePullImage: values.prePullImage,
        rePullImage,
        retryDeploy: values.retryDeploy,
        updateVersion,
        webhook: values.webhookEnabled ? webhookId : '',
        envVars: values.envVars,
        rollbackTo: values.rollbackTo,
        staggerConfig: values.staggerConfig,
      },
      {
        onSuccess: () => {
          notifySuccess(t('common.success'), t('edge.stacks.notifications.deployed'));
          router.stateService.go('^');
        },
      }
    );
  }
}
function getVersions(edgeStack: EdgeStack): Array<number> | undefined {
  if (!isBE) {
    return undefined;
  }

  return _.compact([
    edgeStack.StackFileVersion,
    edgeStack.PreviousDeploymentInfo?.FileVersion,
  ]);
}

function InnerForm({
  edgeStack,
  isLoading,
  allowKubeToSelectCompose,
  versionOptions,
  isSaved,
}: {
  edgeStack: EdgeStack;
  isLoading: boolean;
  allowKubeToSelectCompose: boolean;
  versionOptions: number[] | undefined;
  isSaved: boolean;
}) {
  const { t } = useTranslation();
  const {
    values,
    setFieldValue,
    isValid,
    errors,
    setValues,
    setFieldError,
    initialValues,
  } = useFormikContext<FormValues>();

  usePreventExit(initialValues.content, values.content, !isSaved);

  const { getCachedContent, setContentCache } = useCachedContent();
  const { hasType } = useEdgeGroupHasType(values.edgeGroups);
  const staggerUpdateStatus = useStaggerUpdateStatus(edgeStack.Id);
  const [selectedVersion, setSelectedVersion] = useState(versionOptions?.[0]);
  const selectedParallelOption =
    values.staggerConfig.StaggerOption === StaggerOption.Parallel;

  useEffect(() => {
    if (versionOptions && selectedVersion !== versionOptions[0]) {
      setFieldValue('rollbackTo', selectedVersion);
    } else {
      setFieldValue('rollbackTo', undefined);
    }
  }, [selectedVersion, setFieldValue, versionOptions]);

  const hasKubeEndpoint = hasType(EnvironmentType.EdgeAgentOnKubernetes);
  const hasDockerEndpoint = hasType(EnvironmentType.EdgeAgentOnDocker);

  if (isBE && !staggerUpdateStatus.isSuccess) {
    return null;
  }

  const staggerUpdating =
    staggerUpdateStatus.data === 'updating' && selectedParallelOption;

  const DeploymentForm = forms[values.deploymentType];

  return (
    <Form className="form-horizontal">
      <EdgeGroupsSelector
        value={values.edgeGroups}
        onChange={(value) => setFieldValue('edgeGroups', value)}
        error={errors.edgeGroups}
      />

      {hasKubeEndpoint && hasDockerEndpoint && (
        <TextTip>
          {t('edge.stacks.validation.mixedEnvironmentTypes')}
        </TextTip>
      )}

      {values.deploymentType === DeploymentType.Compose && hasKubeEndpoint && (
        <FormError>
          {t('edge.stacks.validation.composeNoLongerSupportsKube')}
        </FormError>
      )}

      <EdgeStackDeploymentTypeSelector
        allowKubeToSelectCompose={allowKubeToSelectCompose}
        value={values.deploymentType}
        hasDockerEndpoint={hasType(EnvironmentType.EdgeAgentOnDocker)}
        hasKubeEndpoint={hasType(EnvironmentType.EdgeAgentOnKubernetes)}
        onChange={(value) => {
          setFieldValue('content', getCachedContent(value));
          setFieldValue('deploymentType', value);
        }}
      />

      <DeploymentForm
        hasKubeEndpoint={hasType(EnvironmentType.EdgeAgentOnKubernetes)}
        handleContentChange={handleContentChange}
        versionOptions={versionOptions}
        handleVersionChange={handleVersionChange}
      />

      {isBE && (
        <>
          <FormSection title={t('edge.stacks.webhook.title')}>
            <div className="form-group">
              <div className="col-sm-12">
                <SwitchField
                  label={t('edge.stacks.webhook.create')}
                  data-cy="edge-stack-enable-webhook-switch"
                  checked={values.webhookEnabled}
                  labelClass="col-sm-3 col-lg-2"
                  onChange={(value) => setFieldValue('webhookEnabled', value)}
                  tooltip={t('edge.stacks.webhook.tooltip')}
                />
              </div>
            </div>

            {edgeStack.Webhook && (
              <>
                <WebhookSettings
                  baseUrl={baseEdgeStackWebhookUrl()}
                  value={edgeStack.Webhook}
                  docsLink=""
                />

                <TextTip color="orange">
                  {t('edge.stacks.webhook.envVarsNotice')}
                </TextTip>
              </>
            )}
          </FormSection>

          <PrivateRegistryFieldsetWrapper
            value={values.privateRegistryId}
            onChange={(value) => setFieldValue('privateRegistryId', value)}
            values={{
              fileContent: values.content,
            }}
            onFieldError={(error) => setFieldError('privateRegistryId', error)}
            error={errors.privateRegistryId}
          />

          {values.deploymentType === DeploymentType.Compose && (
            <>
              <EnvironmentVariablesPanel
                onChange={(value) => setFieldValue('envVars', value)}
                values={values.envVars}
                errors={errors.envVars}
              />

              <PrePullToggle
                onChange={(value) => setFieldValue('prePullImage', value)}
                value={values.prePullImage}
              />

              <RetryDeployToggle
                onChange={(value) => setFieldValue('retryDeploy', value)}
                value={values.retryDeploy}
              />
            </>
          )}

          <StaggerFieldset
            values={values.staggerConfig}
            onChange={(newStaggerValues) =>
              setValues((values) => ({
                ...values,
                staggerConfig: {
                  ...values.staggerConfig,
                  ...newStaggerValues,
                },
              }))
            }
            errors={errors.staggerConfig}
          />
        </>
      )}

      <FormSection title={t('common.actions')}>
        <div className="form-group">
          <div className="col-sm-12">
            <LoadingButton
              className="!ml-0"
              data-cy="update-stack-button"
              size="small"
              disabled={!isValid || staggerUpdating}
              isLoading={isLoading}
              button-spinner="$ctrl.actionInProgress"
              loadingText={t('edge.stacks.updateInProgress')}
            >
              {t('edge.stacks.update')}
            </LoadingButton>
          </div>
          {staggerUpdating && (
            <div className="col-sm-12">
              <FormError>
                {t('edge.stacks.concurrentUpdatesUnavailable')}
              </FormError>
            </div>
          )}
        </div>
      </FormSection>
    </Form>
  );

  function handleContentChange(type: DeploymentType, content: string) {
    setFieldValue('content', content);
    setContentCache(type, content);
  }

  async function handleVersionChange(newVersion: number) {
    if (!versionOptions) {
      return;
    }

    const fileContent = await getEdgeStackFile(edgeStack.Id, newVersion).catch(
      () => ''
    );
    if (fileContent) {
      if (versionOptions.length > 1) {
        if (newVersion < versionOptions[0]) {
          setSelectedVersion(newVersion);
        } else {
          setSelectedVersion(versionOptions[0]);
        }
      }
      handleContentChange(values.deploymentType, fileContent);
    }
  }
}

function useCachedContent() {
  const [cachedContent, setCachedContent] = useState({
    [DeploymentType.Compose]: '',
    [DeploymentType.Kubernetes]: '',
  });

  function handleChangeContent(type: DeploymentType, content: string) {
    setCachedContent((cache) => ({ ...cache, [type]: content }));
  }

  return {
    setContentCache: handleChangeContent,
    getCachedContent: (type: DeploymentType) => cachedContent[type],
  };
}

function formValidation(): SchemaOf<FormValues> {
  return object({
    content: string().required(i18n.t('validation.contentRequired')),
    deploymentType: number()
      .oneOf([0, 1, 2])
      .required(i18n.t('edge.stacks.validation.deploymentTypeRequired')),
    privateRegistryId: number().optional(),
    prePullImage: boolean().default(false),
    retryDeploy: boolean().default(false),
    useManifestNamespaces: boolean().default(false),
    edgeGroups: array()
      .of(number().required())
      .required()
      .min(1, i18n.t('edge.stacks.validation.atLeastOneEdgeGroup')),
    webhookEnabled: boolean().default(false),
    versions: array().of(number().optional()).optional(),
    envVars: envVarValidation(),
    rollbackTo: number().optional(),
    staggerConfig: staggerConfigValidation(),
  });
}
