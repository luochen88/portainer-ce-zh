import i18n from '@/i18n';

import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmUpdateAppIngress(
  ingressesToUpdate: Array<unknown>,
  servicePortsToUpdate: Array<unknown>
) {
  const hasOneIngress = ingressesToUpdate.length === 1;
  const hasOnePort = servicePortsToUpdate.length === 1;
  const noMatchSentence = i18n.t(
    hasOnePort
      ? 'kubernetes.applications.create.ingressUpdatePrompt.noMatchSinglePort'
      : 'kubernetes.applications.create.ingressUpdatePrompt.noMatchMultiplePorts',
    { count: ingressesToUpdate.length }
  );
  const inputLabel = i18n.t(
    'kubernetes.applications.create.ingressUpdatePrompt.inputLabel',
    { count: ingressesToUpdate.length }
  );

  const result = await openSwitchPrompt(
    i18n.t('kubernetes.common.confirm.areYouSure'),
    inputLabel,
    {
      message: (
      <ul className="ml-3">
        <li>{i18n.t('kubernetes.applications.create.ingressUpdatePrompt.serviceInterruption')}</li>
        <li>{noMatchSentence}</li>
      </ul>
    ),
      confirmButton: buildConfirmButton(
      i18n.t('kubernetes.applications.create.ingressUpdatePrompt.confirmButton')
    ),
      'data-cy': 'kube-update-ingress-prompt-switch',
    }
  );

  return result ? { noMatch: result.value } : undefined;
}
