import i18n from '@/i18n';
import { number, object, SchemaOf } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

import { Options, useIntervalOptions } from './useIntervalOptions';

export const EDGE_ASYNC_INTERVAL_USE_DEFAULT = -1;

export interface EdgeAsyncIntervalsValues {
  PingInterval: number;
  SnapshotInterval: number;
  CommandInterval: number;
}

export const options: Options = [
  { label: i18n.t('edge.intervals.useDefault'), value: -1, isDefault: true },
  {
    value: 0,
    label: i18n.t('common.disabled'),
  },
  {
    value: 60,
    label: i18n.t('time.oneMinute'),
  },
  {
    value: 60 * 60,
    label: i18n.t('time.oneHour'),
  },
  {
    value: 24 * 60 * 60,
    label: i18n.t('time.oneDay'),
  },
  {
    value: 7 * 24 * 60 * 60,
    label: i18n.t('time.oneWeek'),
  },
];

const defaultFieldSettings = {
  ping: {
    label: i18n.t('edge.intervals.ping'),
    tooltip:
      i18n.t('edge.intervals.pingTooltip'),
  },
  snapshot: {
    label: i18n.t('edge.intervals.snapshot'),
    tooltip: i18n.t('edge.intervals.snapshotTooltip'),
  },
  command: {
    label: i18n.t('edge.intervals.command'),
    tooltip:
      i18n.t('edge.intervals.commandTooltip'),
  },
};

interface Props {
  values: EdgeAsyncIntervalsValues;
  isDefaultHidden?: boolean;
  readonly?: boolean;
  fieldSettings?: typeof defaultFieldSettings;
  onChange(value: EdgeAsyncIntervalsValues): void;
}

export function EdgeAsyncIntervalsForm({
  onChange,
  values,
  isDefaultHidden = false,
  readonly = false,
  fieldSettings = defaultFieldSettings,
}: Props) {
  const pingIntervalOptions = useIntervalOptions(
    'Edge.PingInterval',
    options,
    isDefaultHidden
  );

  const snapshotIntervalOptions = useIntervalOptions(
    'Edge.SnapshotInterval',
    options,
    isDefaultHidden
  );

  const commandIntervalOptions = useIntervalOptions(
    'Edge.CommandInterval',
    options,
    isDefaultHidden
  );

  return (
    <>
      <FormControl
        inputId="edge_checkin_ping"
        label={fieldSettings.ping.label}
        tooltip={fieldSettings.ping.tooltip}
      >
        <Select
          id="edge_checkin_ping"
          value={values.PingInterval}
          data-cy="edge-checkin-ping-interval-select"
          name="PingInterval"
          onChange={handleChange}
          options={pingIntervalOptions}
          disabled={readonly}
        />
      </FormControl>

      <FormControl
        inputId="edge_checkin_snapshot"
        label={fieldSettings.snapshot.label}
        tooltip={fieldSettings.snapshot.tooltip}
      >
        <Select
          id="edge_checkin_snapshot"
          value={values.SnapshotInterval}
          data-cy="edge-checkin-snapshot-interval-select"
          name="SnapshotInterval"
          onChange={handleChange}
          options={snapshotIntervalOptions}
          disabled={readonly}
        />
      </FormControl>

      <FormControl
        inputId="edge_checkin_command"
        label={fieldSettings.command.label}
        tooltip={fieldSettings.command.tooltip}
      >
        <Select
          id="edge_checkin_command"
          value={values.CommandInterval}
          data-cy="edge-checkin-command-interval-select"
          name="CommandInterval"
          onChange={handleChange}
          options={commandIntervalOptions}
          disabled={readonly}
        />
      </FormControl>
    </>
  );

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...values, [e.target.name]: parseInt(e.target.value, 10) });
  }
}

const intervals = options.map((option) => option.value);

export function edgeAsyncIntervalsValidation(): SchemaOf<EdgeAsyncIntervalsValues> {
  return object({
    PingInterval: number().required(i18n.t('validation.required')).oneOf(intervals),
    SnapshotInterval: number()
      .required(i18n.t('validation.required'))
      .oneOf(intervals),
    CommandInterval: number()
      .required(i18n.t('validation.required'))
      .oneOf(intervals),
  });
}
