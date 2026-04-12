import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCount } from '@/features/vehicles/utils';
import type { ChartDataEntry } from '@/features/vehicles/utils';

interface MotorEnergyPieChartProps {
  data: ChartDataEntry[];
  title?: string;
}

export function MotorEnergyPieChart({
  data,
  title = 'Distribution Share',
}: MotorEnergyPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            No data available for this source.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
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
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                formatCount(Number(value ?? 0)),
                'Vehicles',
              ]}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
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
      </CardContent>
    </Card>
  );
}
