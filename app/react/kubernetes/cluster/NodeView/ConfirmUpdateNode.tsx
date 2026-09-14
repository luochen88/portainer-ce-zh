import i18n from '@/i18n';

import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmUpdateNode(
  taintsWarning: boolean,
  labelsWarning: boolean,
  cordonWarning: boolean,
  drainWarning: boolean
) {
  let message;
  if (taintsWarning && !labelsWarning) {
    message = i18n.t('kubernetes.cluster.nodes.confirm.taintsMessage');
  } else if (!taintsWarning && labelsWarning) {
    message = i18n.t('kubernetes.cluster.nodes.confirm.labelsMessage');
  } else if (taintsWarning && labelsWarning) {
    message = (
      <>
        <p>{i18n.t('kubernetes.cluster.nodes.confirm.taintsStatement')}</p>
        <p>{i18n.t('kubernetes.cluster.nodes.confirm.labelsStatement')}</p>
        <p>{i18n.t('kubernetes.cluster.nodes.confirm.continueQuestion')}</p>
      </>
    );
  } else if (cordonWarning) {
    message = i18n.t('kubernetes.cluster.nodes.confirm.cordonMessage');
  } else if (drainWarning) {
    message = i18n.t('kubernetes.cluster.nodes.confirm.drainMessage');
  }

  return confirm({
    title: i18n.t('kubernetes.cluster.nodes.confirm.title'),
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton(i18n.t('kubernetes.cluster.nodes.confirm.update'), 'primary'),
  });
}
