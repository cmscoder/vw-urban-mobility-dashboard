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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCount } from '@/features/vehicles/utils';
import type { ChartDataEntry } from '@/features/vehicles/utils';

interface MotorEnergyBarChartProps {
  data: ChartDataEntry[];
  title?: string;
}

export function MotorEnergyBarChart({
  data,
  title = 'Registrations by Motor Type',
}: MotorEnergyBarChartProps) {
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
        <ResponsiveContainer width="100%" height={data.length * 56 + 40}>
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
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
