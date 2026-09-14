import { Trans, useTranslation } from 'react-i18next';

import { InformationPanel } from '@@/InformationPanel';
import { PageHeader } from '@@/PageHeader';

import { EdgeJobsDatatable } from './EdgeJobsDatatable';

export function ListView() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('edge.jobs.title')} breadcrumbs={t('edge.jobs.title')} reload />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel title={t('common.information')}>
            <p className="small text-muted">
              <Trans i18nKey="edge.jobs.requiresCron" components={{ 1: <code /> }} />
            </p>
          </InformationPanel>
        </div>
      </div>

      <EdgeJobsDatatable />
    </>
  );
}
