import { useTranslation } from 'react-i18next';

import { Badge } from '@@/Badge';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

export function RestrictedSecretBadge() {
  const { t } = useTranslation();
  return (
    <TooltipWithChildren message={t('kubernetes.configs.secrets.restrictedTooltip')}>
      <div className="min-w-min">
        <Badge type="warn">{t('kubernetes.configs.secrets.restricted')}</Badge>
      </div>
    </TooltipWithChildren>
  );
}
