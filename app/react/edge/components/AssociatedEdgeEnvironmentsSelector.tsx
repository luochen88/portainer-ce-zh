import { useTranslation, Trans } from 'react-i18next';

import { EdgeTypes, EnvironmentId } from '@/react/portainer/environments/types';
import { EdgeEnvironmentsAssociationTable } from '@/react/edge/components/EdgeEnvironmentsAssociationTable';

import { FormError } from '@@/form-components/FormError';
import { ArrayError } from '@@/form-components/InputList/InputList';

export function AssociatedEdgeEnvironmentsSelector({
  onChange,
  value,
  error,
}: {
  onChange: (
    value: EnvironmentId[],
    meta: { type: 'add' | 'remove'; value: EnvironmentId }
  ) => void;
  value: EnvironmentId[];
  error?: ArrayError<Array<EnvironmentId>>;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="col-sm-12 small text-muted">
        <Trans i18nKey="edge.association.selectIndividually" />
      </div>

      {error && (
        <div className="col-sm-12">
          <FormError>
            {typeof error === 'string' ? error : error.join(', ')}
          </FormError>
        </div>
      )}

      <div className="col-sm-12 mt-4">
        <div className="flex">
          <div className="w-1/2">
            <EdgeEnvironmentsAssociationTable
              title={t('edge.availableEnvironments')}
              query={{
                types: EdgeTypes,
                excludeIds: value,
              }}
              onClickRow={(env) => {
                if (!value.includes(env.Id)) {
                  onChange([...value, env.Id], { type: 'add', value: env.Id });
                }
              }}
              data-cy="edgeGroupCreate-availableEndpoints"
            />
          </div>
          <div className="w-1/2">
            <EdgeEnvironmentsAssociationTable
              title={t('edge.associatedEnvironments')}
              query={{
                types: EdgeTypes,
                endpointIds: value,
              }}
              onClickRow={(env) => {
                if (value.includes(env.Id)) {
                  onChange(
                    value.filter((id) => id !== env.Id),
                    { type: 'remove', value: env.Id }
                  );
                }
              }}
              data-cy="edgeGroupCreate-associatedEndpointsTable"
            />
          </div>
        </div>
      </div>
    </>
  );
}
