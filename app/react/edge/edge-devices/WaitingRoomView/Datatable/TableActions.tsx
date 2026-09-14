import { Trans, useTranslation } from 'react-i18next';

import { Check, CheckCircle } from 'lucide-react';

import { notifySuccess } from '@/portainer/services/notifications';
import { useDeleteEnvironmentsMutation } from '@/react/portainer/environments/ListView/useDeleteEnvironmentsMutation';
import { Environment } from '@/react/portainer/environments/types';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { useIsPureAdmin } from '@/react/hooks/useUser';

import { Button } from '@@/buttons';
import { openModal } from '@@/modals';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { useAssociateDeviceMutation, useLicenseOverused } from '../queries';
import { WaitingRoomEnvironment } from '../types';

import { AssignmentDialog } from './AssignmentDialog/AssignmentDialog';

function OverusedTooltip() {
  return <Trans i18nKey="edge.waitingRoom.tooltips.overused" />;
}

export function TableActions({
  selectedRows,
}: {
  selectedRows: WaitingRoomEnvironment[];
}) {
  const { t } = useTranslation();
  const isPureAdmin = useIsPureAdmin();
  const associateMutation = useAssociateDeviceMutation();
  const removeMutation = useDeleteEnvironmentsMutation();
  const licenseOverused = useLicenseOverused(selectedRows.length);

  return (
    <>
      <DeleteButton
        onConfirmed={() => handleRemoveDevice(selectedRows)}
        disabled={selectedRows.length === 0}
        data-cy="remove-device-button"
        confirmMessage={t('edge.waitingRoom.confirmRemove')}
      >
        {t('edge.waitingRoom.removeDevice')}
      </DeleteButton>

      <TooltipWithChildren
        message={
          licenseOverused ? (
            <OverusedTooltip />
          ) : (
            <>
              <Trans i18nKey="edge.waitingRoom.tooltips.associateAndAssign" />
            </>
          )
        }
      >
        <span>
          <Button
            onClick={() => handleAssociateAndAssign(selectedRows)}
            data-cy="associate-and-assign-button"
            disabled={
              selectedRows.length === 0 || licenseOverused || !isPureAdmin
            }
            color="secondary"
            icon={CheckCircle}
          >
            {t('edge.waitingRoom.associateAndAssignment')}
          </Button>
        </span>
      </TooltipWithChildren>

      <TooltipWithChildren
        message={
          licenseOverused ? (
            <OverusedTooltip />
          ) : (
            <>
              <Trans i18nKey="edge.waitingRoom.tooltips.associateDevice" />
            </>
          )
        }
      >
        <span>
          <Button
            onClick={() => handleAssociateDevice(selectedRows)}
            data-cy="associate-device-button"
            disabled={selectedRows.length === 0 || licenseOverused}
            icon={Check}
          >
            {t('edge.waitingRoom.associateDevice')}
          </Button>
        </span>
      </TooltipWithChildren>
    </>
  );

  async function handleAssociateAndAssign(
    environments: WaitingRoomEnvironment[]
  ) {
    const assigned = await openModal(withReactQuery(AssignmentDialog), {
      environments,
    });

    if (!assigned) {
      return;
    }

    handleAssociateDevice(environments);
  }

  function handleAssociateDevice(devices: Environment[]) {
    associateMutation.mutate(
      devices.map((d) => d.Id),
      {
        onSuccess() {
          notifySuccess(t('common.success'), t('edge.waitingRoom.notifications.associated'));
        },
      }
    );
  }

  async function handleRemoveDevice(devices: Environment[]) {
    removeMutation.mutate(
      devices.map((d) => ({ id: d.Id, name: d.Name })),
      {
        onSuccess() {
          notifySuccess(t('common.success'), t('edge.waitingRoom.notifications.hidden'));
        },
      }
    );
  }
}
