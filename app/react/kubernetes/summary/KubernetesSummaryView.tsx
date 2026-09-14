import { useStore } from 'zustand';
import { Trans, useTranslation } from 'react-i18next';

import { TextTip } from '@@/Tip/TextTip';
import { FormSection } from '@@/form-components/FormSection';

import { summaryStore } from './store';

export type SummaryAction = {
  action: string;
  kind: string;
  name: string;
  type?: string;
};

type Props = {
  actions?: SummaryAction[];
  cpuLimit?: string | null;
  memoryLimit?: string | null;
};

export function KubernetesSummaryView({
  actions = [],
  cpuLimit,
  memoryLimit,
}: Props) {
  const { isExpanded, setIsExpanded } = useStore(summaryStore);
  const { t } = useTranslation();

  if (actions.length === 0) {
    return null;
  }

  return (
    <FormSection
      title={t('kubernetes.summary.title')}
      isFoldable
      defaultFolded={!isExpanded}
      setIsDefaultFolded={(isFolded) => setIsExpanded(!isFolded)}
    >
      <TextTip color="blue">
        {t('kubernetes.summary.actionsIntro')}
      </TextTip>
      <ul className="small text-muted ml-5 w-full">
        {actions.map((action, idx) => {
          if (!action.action || !action.kind || !action.name) {
            return null;
          }
          return (
            <li key={`${idx}-${action.kind}-${action.name}`}>
              <Trans
                i18nKey="kubernetes.summary.actionItem"
                values={{
                  action: action.action,
                  article: getArticle(action.action),
                  kind: action.kind,
                  name: action.name,
                }}
                components={{ kind: <span className="bold" />, name: <code /> }}
              />
              {!!action.type && (
                <Trans
                  i18nKey="kubernetes.summary.actionType"
                  values={{ type: action.type }}
                  components={{ type: <code /> }}
                />
              )}
            </li>
          );
        })}
        {!!memoryLimit && (
          <li>
            <Trans
              i18nKey="kubernetes.summary.memoryLimit"
              values={{ memoryLimit: `${memoryLimit}M` }}
              components={{ limit: <code /> }}
            />
          </li>
        )}
        {!!cpuLimit && (
          <li>
            <Trans
              i18nKey="kubernetes.summary.cpuLimit"
              values={{ cpuLimit }}
              components={{ limit: <code /> }}
            />
          </li>
        )}
      </ul>
    </FormSection>
  );
}

function getArticle(resourceAction: string): string {
  if (resourceAction !== 'Create') {
    return 'the';
  }
  return 'a';
}
