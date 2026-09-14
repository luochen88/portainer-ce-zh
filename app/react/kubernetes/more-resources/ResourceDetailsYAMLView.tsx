import { useMemo } from 'react';
import { useCurrentStateAndParams } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';
import { Code, FileText } from 'lucide-react';

import { useDescribeResource } from '@/react/kubernetes/helm/HelmApplicationView/ReleaseDetails/ResourcesTable/queries/useDescribeResource';

import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody, WidgetTabs } from '@@/Widget';
import { Tab, useCurrentTabIndex } from '@@/Widget/WidgetTabs';
import { Alert } from '@@/Alert';
import { InlineLoader } from '@@/InlineLoader';
import { CodeEditor } from '@@/CodeEditor';

import { YAMLInspector } from '../components/YAMLInspector';
import { useResourceYAML } from '../queries/useResourceYAML';

type ResourceConfig = {
  title: string;
  breadcrumbLabel: string;
  breadcrumbLink: string;
  breadcrumbTab?: string;
  resourceType: string;
  apiVersion: string;
  resourcePlural: string;
  namespaced: boolean;
  yamlIdentifier: string;
  dataCy: string;
};

const fallbackTabs: Tab[] = [
  {
    name: i18n.t('kubernetes.moreResources.resourceDetails.tabs.yaml'),
    icon: Code,
    widget: null,
    selectedTabParam: 'yaml',
  },
  {
    name: i18n.t('kubernetes.moreResources.resourceDetails.tabs.describe'),
    icon: FileText,
    widget: null,
    selectedTabParam: 'describe',
  },
];

export function ResourceDetailsYAMLView() {
  const { state, params } = useCurrentStateAndParams();
  const config = state.data?.resourceConfig as ResourceConfig | undefined;
  const { t } = useTranslation();

  const tabs = useMemo(
    () =>
      config && params.name
        ? buildTabs(config, params.name, params.namespace, params.endpointId, t)
        : fallbackTabs,
    [config, params.name, params.namespace, params.endpointId, t]
  );

  const currentTabIndex = useCurrentTabIndex(tabs);

  if (!config || !params.name) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={config.title}
        breadcrumbs={[
          {
            label: config.breadcrumbLabel,
            link: config.breadcrumbLink,
            linkParams: config.breadcrumbTab
              ? { tab: config.breadcrumbTab }
              : {},
          },
          params.name,
        ]}
        reload
      />

      <>
        <WidgetTabs tabs={tabs} currentTabIndex={currentTabIndex} />
        {tabs[currentTabIndex]?.widget}
      </>
    </>
  );
}

function buildTabs(
  config: ResourceConfig,
  name: string,
  namespace: string | undefined,
  endpointId: number,
  t: (key: string) => string
): Tab[] {
  const resourcePath = buildResourcePath(config, namespace, name);

  return [
    {
      name: t('kubernetes.moreResources.resourceDetails.tabs.yaml'),
      icon: Code,
      widget: (
        <YamlTabContent
          endpointId={endpointId}
          resourcePath={resourcePath}
          config={config}
        />
      ),
      selectedTabParam: 'yaml',
    },
    {
      name: t('kubernetes.moreResources.resourceDetails.tabs.describe'),
      icon: FileText,
      widget: (
        <DescribeTabContent
          name={name}
          resourceType={config.resourceType}
          namespace={namespace}
        />
      ),
      selectedTabParam: 'describe',
    },
  ];
}

function YamlTabContent({
  endpointId,
  resourcePath,
  config,
}: {
  endpointId: number;
  resourcePath: string;
  config: ResourceConfig;
}) {
  const { data, isLoading, isError } = useResourceYAML({
    environmentId: endpointId,
    resourcePath,
    enabled: !!resourcePath,
  });

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            <YAMLInspector
              identifier={config.yamlIdentifier}
              data={data || ''}
              hideMessage
              isLoading={isLoading}
              isError={isError}
              data-cy={config.dataCy}
            />
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}

function DescribeTabContent({
  name,
  resourceType,
  namespace,
}: {
  name: string;
  resourceType: string;
  namespace?: string;
}) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useDescribeResource(
    name,
    resourceType,
    namespace
  );

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            {isLoading && <InlineLoader>{t('kubernetes.common.loading')}</InlineLoader>}
            {isError && (
              <Alert color="error" title={t('kubernetes.common.error')}>
                {t('kubernetes.moreResources.resourceDetails.errors.loading')}
              </Alert>
            )}
            {!isLoading && !isError && (
              <CodeEditor
                id="describe-resource"
                data-cy="describe-resource"
                readonly
                value={data?.describe}
                type="yaml"
              />
            )}
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}

function buildResourcePath(
  config: ResourceConfig,
  namespace: string | undefined,
  name: string
) {
  const apiPrefix = config.apiVersion.includes('/')
    ? `apis/${config.apiVersion}`
    : `api/${config.apiVersion}`;

  if (config.namespaced) {
    if (!namespace) {
      return '';
    }
    return `${apiPrefix}/namespaces/${namespace}/${config.resourcePlural}/${name}`;
  }

  return `${apiPrefix}/${config.resourcePlural}/${name}`;
}
