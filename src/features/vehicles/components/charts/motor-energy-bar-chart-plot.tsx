import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCount } from '@/features/vehicles/utils';
import type { ChartDataEntry } from '@/features/vehicles/utils';
import { MOTOR_ENERGY_CHART_TOOLTIP_CONTENT_STYLE } from './motor-energy-chart-tooltip-style';

const BAR_ROW_HEIGHT_PX = 56;
const BAR_CHART_EXTRA_HEIGHT_PX = 40;

interface MotorEnergyBarChartPlotProps {
  data: ChartDataEntry[];
}

export function MotorEnergyBarChartPlot({
  data,
}: MotorEnergyBarChartPlotProps) {
  const chartHeight =
    data.length * BAR_ROW_HEIGHT_PX + BAR_CHART_EXTRA_HEIGHT_PX;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatCount(v)}
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={180}
          fontSize={12}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [formatCount(Number(value ?? 0)), 'Vehicles']}
          contentStyle={MOTOR_ENERGY_CHART_TOOLTIP_CONTENT_STYLE}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
