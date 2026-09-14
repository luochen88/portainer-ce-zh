import { CpuIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatsLineChart } from '@/react/components/Charts/StatsLineChart';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';

import { ChartPoint, formatPercent } from '../chartPoint';

import { SECONDARY } from './colors';

type Props = {
  chartData: ChartPoint[];
};

export function CpuUsageChart({ chartData }: Props) {
  const { t } = useTranslation();
  return (
    <Widget>
      <WidgetTitle icon={CpuIcon} title={t('kubernetes.metrics.charts.cpuUsage')} />
      <WidgetBody>
        <StatsLineChart
          data={chartData}
          series={[
            {
              dataKey: 'cpu',
              name: t('kubernetes.metrics.charts.cpu'),
              color: SECONDARY,
              area: true,
            },
          ]}
          yAxisFormatter={formatPercent}
        />
      </WidgetBody>
    </Widget>
  );
}
