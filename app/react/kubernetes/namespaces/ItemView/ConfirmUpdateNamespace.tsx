import { Trans } from 'react-i18next';

import i18n from '@/i18n';

import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

type Warnings = {
  quota: boolean;
  ingress: boolean;
  registries: boolean;
};

export function confirmUpdateNamespace(warnings: Warnings) {
  const message = (
    <>
      {warnings.quota && (
        <p>
          <Trans i18nKey="kubernetes.namespaces.updateConfirm.quotaWarning" />
        </p>
      )}
      {warnings.ingress && (
        <p>
          <Trans i18nKey="kubernetes.namespaces.updateConfirm.ingressWarning" />
        </p>
      )}
      {warnings.registries && (
        <p>
          <Trans i18nKey="kubernetes.namespaces.updateConfirm.registriesWarning" />
        </p>
      )}
      <p>{i18n.t('kubernetes.common.confirm.continue')}</p>
    </>
  );

  return confirm({
    title: i18n.t('kubernetes.common.confirm.title'),
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton(
      i18n.t('kubernetes.common.actions.update'),
      'primary'
    ),
  });
}
