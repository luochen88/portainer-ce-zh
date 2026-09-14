import {
  AlertTriangle,
  CheckCircle,
  type LucideIcon,
  Loader2,
  XCircle,
  MinusCircle,
  PauseCircle,
} from 'lucide-react';

import i18n from '@/i18n';

import { Icon, IconMode } from '@@/Icon';
import { Tooltip } from '@@/Tip/Tooltip';

import { DecoratedEdgeStack, StatusSummary, SummarizedStatus } from './types';

export function EdgeStackStatus({
  edgeStack,
}: {
  edgeStack: DecoratedEdgeStack;
}) {
  const { StatusSummary } = edgeStack;

  const { icon, label, mode, spin, tooltip } = getStatus(StatusSummary);

  return (
    <div className="mx-auto inline-flex items-center gap-2">
      {icon && <Icon icon={icon} spin={spin} mode={mode} />}
      {label}
      {tooltip && <Tooltip message={tooltip} />}
    </div>
  );
}

function getStatus(summary?: StatusSummary): {
  label: string;
  icon?: LucideIcon;
  spin?: boolean;
  mode?: IconMode;
  tooltip?: string;
} {
  if (!summary) {
    return {
      label: i18n.t('edge.stacks.status.unavailable'),
      icon: MinusCircle,
      mode: 'secondary',
      tooltip: i18n.t('edge.stacks.status.summaryUnavailable'),
    };
  }
  const { Status, Reason } = summary;

  switch (Status) {
    case SummarizedStatus.Deploying:
      return {
        label: i18n.t('edge.stacks.status.deploying'),
        icon: Loader2,
        spin: true,
        mode: 'primary',
      };
    case SummarizedStatus.Failed:
      return {
        label: i18n.t('edge.stacks.status.failed'),
        icon: XCircle,
        mode: 'danger',
      };
    case SummarizedStatus.Paused:
      return {
        label: i18n.t('edge.stacks.status.paused'),
        icon: PauseCircle,
        mode: 'warning',
      };
    case SummarizedStatus.PartiallyRunning:
      return {
        label: i18n.t('edge.stacks.status.partiallyRunning'),
        icon: AlertTriangle,
        mode: 'warning',
      };
    case SummarizedStatus.Completed:
      return {
        label: i18n.t('edge.stacks.status.completed'),
        icon: CheckCircle,
        mode: 'success',
      };
    case SummarizedStatus.Running:
      return {
        label: i18n.t('edge.stacks.status.running'),
        icon: CheckCircle,
        mode: 'success',
      };
    case SummarizedStatus.Unavailable:
    default:
      return {
        label: i18n.t('edge.stacks.status.unavailable'),
        icon: MinusCircle,
        mode: 'secondary',
        tooltip: Reason,
      };
  }
}
