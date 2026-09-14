import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody } from '@@/Widget';

import { CreateContainerInstanceForm } from './CreateContainerInstanceForm';

export function CreateView() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('azure.containerInstances.create.title')}
        breadcrumbs={[
          { link: 'azure.containerinstances', label: t('azure.containerInstances.title') },
          { label: t('azure.containerInstances.addContainer') },
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetBody>
              <CreateContainerInstanceForm />
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );
}
