import { useTranslation } from 'react-i18next';

import { SwitchField } from '@@/form-components/SwitchField';

import { FormValues } from './types';

export function DeploymentOptions({
  setFieldValue,
  values,
}: {
  values: FormValues;
  setFieldValue: <T>(field: string, value: T) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.prePullImage}
            name="prePullImage"
            label={t('edge.stacks.prePullImages')}
            tooltip={t('edge.stacks.prePullTooltip')}
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) => setFieldValue('prePullImage', value)}
            data-cy="pre-pull-images-switch"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.retryDeploy}
            name="retryDeploy"
            label={t('edge.stacks.retryDeployment')}
            tooltip={t('edge.stacks.retryDeploymentTooltip')}
            labelClass="col-sm-3 col-lg-2"
            onChange={(value) => setFieldValue('retryDeploy', value)}
            data-cy="retry-deployment-switch"
          />
        </div>
      </div>
    </>
  );
}
