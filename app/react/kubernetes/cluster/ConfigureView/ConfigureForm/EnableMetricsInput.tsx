import { Field, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';

import { useGetMetricsMutation } from '@/react/kubernetes/queries/useGetMetricsMutation';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Switch } from '@@/form-components/SwitchField/Switch';
import { InlineLoader } from '@@/InlineLoader';

import { ConfigureFormValues } from './types';

type Props = {
  environmentId: number;
  value: boolean;
  error?: string;
};

export function EnableMetricsInput({ value, error, environmentId }: Props) {
  const { setFieldValue } = useFormikContext<ConfigureFormValues>();
  const [metricsFound, setMetricsFound] = useState<boolean>();
  const { t } = useTranslation();
  const getMetricsMutation = useGetMetricsMutation();
  return (
    <div className="mb-4">
      <TextTip color="blue">
        <p>{t('kubernetes.cluster.configure.metrics.description')}</p>
      </TextTip>
      <FormControl
        label={t('kubernetes.cluster.configure.metrics.enable')}
        className="mb-0"
        size="large"
        errors={error}
        inputId="kubeSetup-metricsToggle"
      >
        <Field
          name="useServerMetrics"
          as={Switch}
          checked={value}
          id="kubeSetup-metricsToggle"
          onChange={(checked: boolean) => {
            // if turning off, just set the value
            if (!checked) {
              setFieldValue('useServerMetrics', checked);
              return;
            }
            // if turning on, see if the metrics server is available, then set the value to on if it is
            getMetricsMutation.mutate(environmentId, {
              onSuccess: () => {
                setMetricsFound(true);
                setFieldValue('useServerMetrics', checked);
              },
              onError: () => {
                setMetricsFound(false);
              },
            });
          }}
          data-cy="kubeSetup-metricsToggle"
        />
      </FormControl>
      {getMetricsMutation.isLoading && (
        <InlineLoader size="sm">{t('kubernetes.cluster.configure.metrics.checking')}</InlineLoader>
      )}
      {!getMetricsMutation.isLoading && (
        <>
          {metricsFound === false && (
            <TextTip color="red" icon={XCircle}>
              {t('kubernetes.cluster.configure.metrics.unreachable')}
            </TextTip>
          )}
          {metricsFound === true && (
            <TextTip color="green" icon={CheckCircle}>
              {t('kubernetes.cluster.configure.metrics.reachable')}
            </TextTip>
          )}
        </>
      )}
    </div>
  );
}
