import { TextTip } from '@@/Tip/TextTip';
import { useTranslation } from 'react-i18next';

import { SwitchField } from '@@/form-components/SwitchField';

export function WebhookSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="form-section-title">{t('edge.stacks.webhook.title')}</div>
      <SwitchField
        label={t('edge.stacks.webhook.create')}
        checked={value}
        onChange={onChange}
        tooltip={t('edge.stacks.webhook.tooltip')}
        labelClass="col-sm-3 col-lg-2"
        data-cy="webhook-switch"
      />

      {value && (
        <TextTip>
          {t('edge.stacks.webhook.envVarsNotice')}
        </TextTip>
      )}
    </div>
  );
}
