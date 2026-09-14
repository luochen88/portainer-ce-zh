import { useTranslation } from 'react-i18next';

import { Alert } from '@@/Alert';
import { SwitchField } from '@@/form-components/SwitchField';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';

import { DrainOptions as DrainOptionsValues } from './types';

interface Props {
  values: DrainOptionsValues;
  onChange: (values: DrainOptionsValues) => void;
  hasNodeWriteAccess: boolean;
}

export function DrainOptions({ values, onChange, hasNodeWriteAccess }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <FormSectionTitle titleSize="sm">{t('kubernetes.cluster.nodes.drainOptions.title')}</FormSectionTitle>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label={t('kubernetes.cluster.nodes.drainOptions.ignoreDaemonSets')}
            labelClass="col-sm-5 col-lg-4"
            tooltip={t('kubernetes.cluster.nodes.drainOptions.ignoreDaemonSetsTooltip')}
            checked={values.ignoreDaemonSets}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) =>
              onChange({ ...values, ignoreDaemonSets: checked })
            }
            data-cy="node-drain-ignore-daemonsets"
          />
        </div>
      </div>
      <FormControl label={t('kubernetes.cluster.nodes.drainOptions.timeout')} size="large">
        <Input
          type="number"
          min="0"
          className="max-w-[8rem]"
          value={values.timeoutSeconds}
          disabled={!hasNodeWriteAccess}
          onChange={(e) =>
            onChange({ ...values, timeoutSeconds: Number(e.target.value) })
          }
          data-cy="node-drain-timeout-input"
        />
      </FormControl>
      <FormControl label={t('kubernetes.cluster.nodes.drainOptions.gracePeriod')} size="large">
        <Input
          type="number"
          min="-1"
          className="max-w-[8rem]"
          value={values.gracePeriodSeconds}
          disabled={!hasNodeWriteAccess}
          onChange={(e) =>
            onChange({
              ...values,
              gracePeriodSeconds: Number(e.target.value),
            })
          }
          data-cy="node-drain-grace-period-input"
        />
      </FormControl>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label={t('kubernetes.cluster.nodes.drainOptions.force')}
            labelClass="col-sm-5 col-lg-4"
            tooltip={t('kubernetes.cluster.nodes.drainOptions.forceTooltip')}
            checked={values.force}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) => onChange({ ...values, force: checked })}
            data-cy="node-drain-force"
          />
        </div>
      </div>
      {values.force && (
        <div className="form-group">
          <div className="col-sm-12">
            <Alert color="warn">
              {t('kubernetes.cluster.nodes.drainOptions.forceWarning')}
            </Alert>
          </div>
        </div>
      )}
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label={t('kubernetes.cluster.nodes.drainOptions.deleteEmptyDirData')}
            labelClass="col-sm-5 col-lg-4"
            tooltip={t('kubernetes.cluster.nodes.drainOptions.deleteEmptyDirDataTooltip')}
            checked={values.deleteEmptyDirData}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) =>
              onChange({ ...values, deleteEmptyDirData: checked })
            }
            data-cy="node-drain-delete-emptydir"
          />
        </div>
      </div>
      {values.deleteEmptyDirData && (
        <div className="form-group">
          <div className="col-sm-12">
            <Alert color="warn">
              {t('kubernetes.cluster.nodes.drainOptions.deleteEmptyDirDataWarning')}
            </Alert>
          </div>
        </div>
      )}
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label={t('kubernetes.cluster.nodes.drainOptions.disableEviction')}
            labelClass="col-sm-5 col-lg-4"
            tooltip={t('kubernetes.cluster.nodes.drainOptions.disableEvictionTooltip')}
            checked={values.disableEviction}
            disabled={!hasNodeWriteAccess}
            onChange={(checked) =>
              onChange({ ...values, disableEviction: checked })
            }
            data-cy="node-drain-disable-eviction"
          />
        </div>
      </div>
      {values.disableEviction && (
        <div className="form-group">
          <div className="col-sm-12">
            <Alert color="warn">
              {t('kubernetes.cluster.nodes.drainOptions.disableEvictionWarning')}
            </Alert>
          </div>
        </div>
      )}
    </>
  );
}
