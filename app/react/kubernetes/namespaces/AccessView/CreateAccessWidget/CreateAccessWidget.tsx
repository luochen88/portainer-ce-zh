import { UserPlusIcon } from 'lucide-react';
import { Formik } from 'formik';
import { useMemo } from 'react';
import { useCurrentStateAndParams } from '@uirouter/react';
import { Trans, useTranslation } from 'react-i18next';

import { useIsRBACEnabled } from '@/react/kubernetes/cluster/useIsRBACEnabled';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { RBACAlert } from '@/react/kubernetes/cluster/ConfigureView/ConfigureForm/RBACAlert';
import { useUsers } from '@/portainer/users/queries';
import { PortainerNamespaceAccessesConfigMap } from '@/react/kubernetes/configs/constants';
import { useConfigMap } from '@/react/kubernetes/configs/queries/useConfigMap';
import { useTeams } from '@/react/portainer/users/teams/queries';
import { useUpdateK8sConfigMapMutation } from '@/react/kubernetes/configs/queries/useUpdateK8sConfigMapMutation';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { Configuration } from '@/react/kubernetes/configs/types';
import { useCurrentUser } from '@/react/hooks/useUser';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';

import { EnvironmentAccess } from '../types';
import { createAuthorizeAccessConfigMapPayload } from '../createAccessConfigMapPayload';
import { parseNamespaceAccesses } from '../parseNamespaceAccesses';

import { CreateAccessValues } from './types';
import { CreateAccessInnerForm } from './CreateAccessInnerForm';
import { validationSchema } from './createAccess.validation';

export function CreateAccessWidget() {
  const { t } = useTranslation();
  const {
    params: { id: namespaceName },
  } = useCurrentStateAndParams();
  const { user } = useCurrentUser();
  const environmentId = useEnvironmentId();
  const isRBACEnabledQuery = useIsRBACEnabled(environmentId);
  const initialValues: {
    selectedUsersAndTeams: EnvironmentAccess[];
  } = {
    selectedUsersAndTeams: [],
  };
  const usersQuery = useUsers(false, environmentId);
  const teamsQuery = useTeams(false, environmentId);
  const accessConfigMapQuery = useConfigMap(
    environmentId,
    PortainerNamespaceAccessesConfigMap.namespace,
    PortainerNamespaceAccessesConfigMap.configMapName
  );
  const namespaceAccesses = useMemo(
    () =>
      parseNamespaceAccesses(
        accessConfigMapQuery.data ?? null,
        namespaceName,
        usersQuery.data ?? [],
        teamsQuery.data ?? []
      ),
    [accessConfigMapQuery.data, usersQuery.data, teamsQuery.data, namespaceName]
  );
  const configMap = accessConfigMapQuery.data;

  const updateConfigMapMutation = useUpdateK8sConfigMapMutation(
    environmentId,
    PortainerNamespaceAccessesConfigMap.namespace
  );

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget aria-label={t('kubernetes.namespaces.access.create.title')}>
          <WidgetTitle icon={UserPlusIcon} title={t('kubernetes.namespaces.access.create.title')} />
          <WidgetBody>
            {isRBACEnabledQuery.data === false && <RBACAlert />}
            <TextTip className="mb-2" childrenWrapperClassName="text-warning">
              <Trans i18nKey="kubernetes.namespaces.access.create.tip" />
            </TextTip>
            {isRBACEnabledQuery.data !== false && (
              <Formik<CreateAccessValues>
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={(values, formikHelpers) =>
                  onSubmit(values, formikHelpers)
                }
                validateOnMount
              >
                {(formikProps) => (
                  <CreateAccessInnerForm
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...formikProps}
                    namespaceAccessesGranted={namespaceAccesses}
                  />
                )}
              </Formik>
            )}
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );

  async function onSubmit(
    values: {
      selectedUsersAndTeams: EnvironmentAccess[];
    },
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      const configMapPayload = createAuthorizeAccessConfigMapPayload(
        namespaceAccesses,
        values.selectedUsersAndTeams,
        namespaceName,
        configMap ?? newConfigMap(user.Username, user.Id)
      );
      await updateConfigMapMutation.mutateAsync({
        configMap: configMapPayload,
        configMapName: PortainerNamespaceAccessesConfigMap.configMapName,
      });
      notifySuccess(t('kubernetes.common.notifications.success'), t('kubernetes.namespaces.access.updated'));
      resetForm();
    } catch (error) {
      notifyError(t('kubernetes.namespaces.access.updateFailure'), error as Error);
    }
  }
}

function newConfigMap(userName: string, userId: number) {
  const configMap: Configuration = {
    Type: 1,
    UID: '',
    Name: PortainerNamespaceAccessesConfigMap.configMapName,
    Namespace: PortainerNamespaceAccessesConfigMap.namespace,
    Data: { [PortainerNamespaceAccessesConfigMap.accessKey]: '{}' },
    ConfigurationOwner: userName,
    ConfigurationOwnerId: `${userId}`,
    IsUsed: false,
    Yaml: '',
  };
  return configMap;
}
