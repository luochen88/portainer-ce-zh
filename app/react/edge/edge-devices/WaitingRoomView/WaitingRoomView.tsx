import { Trans, useTranslation } from 'react-i18next';

import { withLimitToBE } from '@/react/hooks/useLimitToBE';

import { InformationPanel } from '@@/InformationPanel';
import { TextTip } from '@@/Tip/TextTip';
import { PageHeader } from '@@/PageHeader';
import { Link } from '@@/Link';
import { Alert } from '@@/Alert';

import { Datatable } from './Datatable';
import { useLicenseOverused, useUntrustedCount } from './queries';

export default withLimitToBE(WaitingRoomView);

function WaitingRoomView() {
  const { t } = useTranslation();
  const untrustedCount = useUntrustedCount();
  const licenseOverused = useLicenseOverused(untrustedCount);
  return (
    <>
      <PageHeader
        title={t('edge.waitingRoom.title')}
        breadcrumbs={[{ label: t('edge.waitingRoom.title') }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel>
            <TextTip color="blue">
              <Trans i18nKey="edge.waitingRoom.autoOnboardingNotice" components={{ 1: <Link to="portainer.endpoints.edgeAutoCreateScript" data-cy="waitingRoom-edgeAutoCreateScriptLink" /> }} />
            </TextTip>
          </InformationPanel>
        </div>
      </div>

      {licenseOverused && (
        <div className="row">
          <div className="col-sm-12">
            <Alert color="warn">
              <Trans i18nKey="edge.waitingRoom.licenseOverusedNotice" components={{ 1: <Link to="portainer.licenses" data-cy="waitingRoom-portainerLicensesLink" /> }} />
            </Alert>
          </div>
        </div>
      )}

      <Datatable />
    </>
  );
}
