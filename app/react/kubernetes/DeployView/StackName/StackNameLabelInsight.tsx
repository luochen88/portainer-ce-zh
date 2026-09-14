import { Trans, useTranslation } from 'react-i18next';

import { useCurrentUser } from '@/react/hooks/useUser';

import { InsightsBox } from '@@/InsightsBox';
import { Link } from '@@/Link';

export function StackNameLabelInsight() {
  const { t } = useTranslation();
  const { isPureAdmin } = useCurrentUser();
  const insightsBoxContent = (
    <>
      <Trans i18nKey="kubernetes.deploy.stackName.insight.content">
        The stack field below was previously labelled &apos;Name&apos; but, in fact,
        it&apos;s always been the stack name (hence the relabelling).
      </Trans>
      {isPureAdmin && (
        <>
          <br />
          <Trans
            i18nKey="kubernetes.deploy.stackName.insight.admin"
            components={{
              1: (
                <Link
                  to="portainer.settings"
                  target="_blank"
                  data-cy="k8s-deploy-settings-link"
                />
              ),
            }}
            defaultValue="Kubernetes Stacks functionality can be turned off entirely via <1>Kubernetes Settings</1>."
          />
        </>
      )}
    </>
  );

  return (
    <InsightsBox
      type="slim"
      header={t('kubernetes.deploy.stackName.label')}
      content={insightsBoxContent}
      insightCloseId="k8s-stacks-name"
    />
  );
}
