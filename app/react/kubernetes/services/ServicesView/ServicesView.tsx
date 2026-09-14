import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';

import { ServicesDatatable } from './ServicesDatatable';

export function ServicesView() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t('kubernetes.services.list.title')} breadcrumbs={t('kubernetes.services.list.breadcrumb')} reload />
      <ServicesDatatable />
    </>
  );
}
