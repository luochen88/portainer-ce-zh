import { Field, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import {
  ContainerInstanceFormValues,
  ProviderViewModel,
  ResourceGroup,
} from '@/react/azure/types';
import {
  getSubscriptionLocations,
  getSubscriptionResourceGroups,
} from '@/react/azure/container-instances/CreateView/utils';
import { PortsMappingField } from '@/react/azure/container-instances/CreateView/PortsMappingField';
import { AccessControlForm } from '@/react/portainer/access-control';

import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { FormControl } from '@@/form-components/FormControl';
import { Input, Select } from '@@/form-components/Input';
import { EnvironmentVariablesPanel } from '@@/form-components/EnvironmentVariablesFieldset';
import { LoadingButton } from '@@/buttons';
import { Option } from '@@/form-components/PortainerSelect';

type Props = FormikProps<ContainerInstanceFormValues> & {
  subscriptionOptions: Option<string>[];
  environmentId: number;
  resourceGroups: Record<string, ResourceGroup[]>;
  providers: Record<string, ProviderViewModel | undefined>;
};

export function CreateContainerInstanceInnerForm({
  errors,
  handleSubmit,
  isSubmitting,
  isValid,
  values,
  setFieldValue,
  environmentId,
  subscriptionOptions,
  resourceGroups,
  providers,
}: Props) {
  const { t } = useTranslation();

  return (
    <Form className="form-horizontal" onSubmit={handleSubmit} noValidate>
      <FormSectionTitle>{t('azure.containerInstances.sections.azureSettings')}</FormSectionTitle>
      <FormControl
        label={t('azure.containerInstances.fields.subscription')}
        inputId="subscription-input"
        errors={errors.subscription}
      >
        <Field
          name="subscription"
          as={Select}
          id="subscription-input"
          options={subscriptionOptions}
        />
      </FormControl>

      <FormControl
        label={t('azure.containerInstances.fields.resourceGroup')}
        inputId="resourceGroup-input"
        errors={errors.resourceGroup}
      >
        <Field
          name="resourceGroup"
          as={Select}
          id="resourceGroup-input"
          options={getSubscriptionResourceGroups(
            values.subscription,
            resourceGroups
          )}
        />
      </FormControl>

      <FormControl
        label={t('azure.containerInstances.fields.location')}
        inputId="location-input"
        errors={errors.location}
      >
        <Field
          name="location"
          as={Select}
          id="location-input"
          options={getSubscriptionLocations(values.subscription, providers)}
        />
      </FormControl>

      <FormSectionTitle>{t('azure.containerInstances.sections.containerConfiguration')}</FormSectionTitle>

      <FormControl label={t('azure.containerInstances.fields.name')} inputId="name-input" errors={errors.name}>
        <Field
          name="name"
          as={Input}
          id="name-input"
          placeholder="e.g. myContainer"
        />
      </FormControl>

      <FormControl label={t('azure.containerInstances.fields.image')} inputId="image-input" errors={errors.image}>
        <Field
          name="image"
          as={Input}
          id="image-input"
          placeholder="e.g. nginx:alpine"
        />
      </FormControl>

      <FormControl label={t('azure.containerInstances.fields.os')} inputId="os-input" errors={errors.os}>
        <Field
          name="os"
          as={Select}
          id="os-input"
          options={[
            { label: t('azure.containerInstances.os.linux'), value: 'Linux' },
            { label: t('azure.containerInstances.os.windows'), value: 'Windows' },
          ]}
        />
      </FormControl>

      <PortsMappingField
        value={values.ports}
        onChange={(value) => setFieldValue('ports', value)}
        errors={errors.ports}
      />

      <EnvironmentVariablesPanel
        values={values.env}
        onChange={(env) => setFieldValue('env', env)}
        errors={errors.env}
      />

      <div className="form-group">
        <div className="col-sm-12 small text-muted">
          {t('azure.containerInstances.publicIpNotice')}
        </div>
      </div>

      <FormSectionTitle>{t('azure.containerInstances.sections.containerResources')}</FormSectionTitle>

      <FormControl label={t('azure.containerInstances.fields.cpu')} inputId="cpu-input" errors={errors.cpu}>
        <Field
          name="cpu"
          as={Input}
          id="cpu-input"
          type="number"
          placeholder="1"
        />
      </FormControl>

      <FormControl label={t('azure.containerInstances.fields.memory')} inputId="cpu-input" errors={errors.memory}>
        <Field
          name="memory"
          as={Input}
          id="memory-input"
          type="number"
          placeholder="1"
        />
      </FormControl>

      <AccessControlForm
        formNamespace="accessControl"
        onChange={(values) => setFieldValue('accessControl', values)}
        values={values.accessControl}
        errors={errors.accessControl}
        environmentId={environmentId}
      />

      <div className="form-group">
        <div className="col-sm-12">
          <LoadingButton
            disabled={!isValid}
            isLoading={isSubmitting}
            loadingText={t('azure.containerInstances.deploymentInProgress')}
            icon={Plus}
            data-cy="aci-create-button"
          >
            {t('azure.containerInstances.deployContainer')}
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}
