import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { useTranslation } from 'react-i18next';

import { BETeaserButton } from '@@/BETeaserButton';
import { Tooltip } from '@@/Tip/Tooltip';

export function AnnotationsBeTeaser() {
  const { t } = useTranslation();
  return (
    <div className="col-sm-12 text-muted mb-2 block px-0">
      <div className="control-label !mb-2 text-left font-medium">
        Annotations
        <Tooltip
          message={
            <div className="vertical-center">
              <span>
                Allows specifying of{' '}
                <a
                  href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/"
                  target="_black"
                >
                  annotations
                </a>{' '}
                for the object. See further Kubernetes documentation on{' '}
                <a
                  href="https://kubernetes.io/docs/reference/labels-annotations-taints/"
                  target="_black"
                >
                  well-known annotations
                </a>
                .
              </span>
            </div>
          }
        />
      </div>
      <div className="block">
        <BETeaserButton
          className="!p-0"
          heading={t('kubernetes.annotations.teaser.heading')}
          buttonText={t('kubernetes.annotations.teaser.button')}
          message={t('kubernetes.annotations.teaser.message')}
          featureId={FeatureId.K8S_ANNOTATIONS}
          buttonClassName="!ml-0"
          data-cy="annotations-be-teaser"
        />
      </div>
    </div>
  );
}
