import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { notifySuccess } from '@/portainer/services/notifications';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';

import { useCreateEdgeGroupMutation } from '../queries/useCreateEdgeGroupMutation';
import { EdgeGroupForm } from '../components/EdgeGroupForm/EdgeGroupForm';

export function CreateView() {
  const { t } = useTranslation();
  const mutation = useCreateEdgeGroupMutation();
  const router = useRouter();

  return (
    <>
      <PageHeader
        title={t('edge.groups.create.title')}
        breadcrumbs={[
          { label: t('edge.groups.title'), link: 'edge.groups' },
          t('edge.groups.add'),
        ]}
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              <EdgeGroupForm
                onSubmit={({ environmentIds, ...values }) => {
                  mutation.mutate(
                    {
                      endpoints: environmentIds,
                      ...values,
                    },
                    {
                      onSuccess: () => {
                        notifySuccess(
                          t('common.success'),
                          t('edge.groups.notifications.created')
                        );
                        router.stateService.go('^');
                      },
                    }
                  );
                }}
                isLoading={mutation.isLoading}
              />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
