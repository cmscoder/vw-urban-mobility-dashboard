import { MotorEnergyBarChartPlot } from './motor-energy-bar-chart-plot';
import { MotorEnergyChartCard } from './motor-energy-chart-ui';
import type { ChartDataEntry } from '@/features/vehicles/utils';

interface MotorEnergyBarChartProps {
  data: ChartDataEntry[];
  isEmpty: boolean;
  title?: string;
}

export function MotorEnergyBarChart({
  data,
  isEmpty,
  title = 'Registrations by Motor Type',
}: MotorEnergyBarChartProps) {
  return (
    <MotorEnergyChartCard title={title} isEmpty={isEmpty}>
      {!isEmpty && <MotorEnergyBarChartPlot data={data} />}
    </MotorEnergyChartCard>
  );
}
