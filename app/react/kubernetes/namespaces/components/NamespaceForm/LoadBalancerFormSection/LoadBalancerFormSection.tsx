import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

export function LoadBalancerFormSection() {
  const { t } = useTranslation();

  return (
    <FormSection title={t('kubernetes.namespaces.form.loadBalancers.title')}>
      <TextTip color="blue">
        {t('kubernetes.namespaces.form.loadBalancers.tip')}
      </TextTip>
      <SwitchField
        data-cy="k8sNamespaceCreate-loadBalancerQuotaToggle"
        label={t('kubernetes.namespaces.form.loadBalancers.quotaLabel')}
        labelClass="col-sm-3 col-lg-2"
        fieldClass="pt-2"
        checked={false}
        featureId={FeatureId.K8S_RESOURCE_POOL_LB_QUOTA}
        onChange={() => {}}
      />
    </FormSection>
  );
}
