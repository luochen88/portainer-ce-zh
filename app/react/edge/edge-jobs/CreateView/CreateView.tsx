import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';

import { CreateEdgeJobForm } from './CreateEdgeJobForm';

export function CreateView() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('edge.jobs.create.title')}
        breadcrumbs={[
          { label: t('edge.jobs.title'), link: 'edge.jobs' },
          t('edge.jobs.create.title'),
        ]}
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              <CreateEdgeJobForm />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
