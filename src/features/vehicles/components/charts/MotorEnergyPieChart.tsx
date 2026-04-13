import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MotorEnergyChartCard } from './motor-energy-chart-ui';
import { MOTOR_ENERGY_CHART_TOOLTIP_CONTENT_STYLE } from './motor-energy-chart-tooltip-style';
import { formatCount } from '@/features/vehicles/utils';
import type { ChartDataEntry } from '@/features/vehicles/utils';

interface MotorEnergyPieChartProps {
  data: ChartDataEntry[];
  isEmpty: boolean;
  title?: string;
}

export function MotorEnergyPieChart({
  data,
  isEmpty,
  title = 'Distribution Share',
}: MotorEnergyPieChartProps) {
  const total = isEmpty ? 0 : data.reduce((sum, d) => sum + d.count, 0);

  return (
    <MotorEnergyChartCard title={title} isEmpty={isEmpty}>
      {!isEmpty && (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  formatCount(Number(value ?? 0)),
                  'Vehicles',
                ]}
                contentStyle={MOTOR_ENERGY_CHART_TOOLTIP_CONTENT_STYLE}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-2 space-y-1.5">
            {data.map((entry) => {
              const pct =
                total > 0 ? ((entry.count / total) * 100).toFixed(1) : '0';
              return (
                <div
                  key={entry.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-medium">{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </MotorEnergyChartCard>
  );
}
