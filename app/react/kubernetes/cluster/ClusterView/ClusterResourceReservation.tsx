import { Widget, WidgetBody } from '@/react/components/Widget';
import { useTranslation } from 'react-i18next';
import { ResourceReservation } from '@/react/kubernetes/components/ResourceReservation';

import { useClusterResourceReservationData } from './useClusterResourceReservationData';

export function ClusterResourceReservation() {
  const { t } = useTranslation();
  // Load all data required for this component
  const {
    cpuLimit,
    memoryLimit,
    isLoading,
    displayResourceUsage,
    resourceUsage,
    resourceReservation,
    displayWarning,
  } = useClusterResourceReservationData();

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            <ResourceReservation
              isLoading={isLoading}
              displayResourceUsage={displayResourceUsage}
              resourceReservation={resourceReservation}
              resourceUsage={resourceUsage}
              cpuLimit={cpuLimit}
              memoryLimit={memoryLimit}
              memoryUnit="MiB"
              description={t('kubernetes.cluster.resourceReservation.description')}
              displayWarning={displayWarning}
              warningMessage={t('kubernetes.cluster.resourceReservation.metricsWarning')}
            />
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
