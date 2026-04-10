import { CHART_COLORS } from '@/features/vehicles/constants';
import type { VehicleRecord } from '@/features/vehicles/types';

export interface ChartDataEntry {
  name: string;
  count: number;
  source: 'eurostat' | 'local';
  fill: string;
}

export function buildChartData(records: VehicleRecord[]): ChartDataEntry[] {
  const motorTypes = [...new Set(records.map((r) => r.motorEnergyName))];

  return records
    .map((r) => {
      const colorIndex = motorTypes.indexOf(r.motorEnergyName);
      const baseColor = CHART_COLORS[colorIndex % CHART_COLORS.length];

      return {
        name:
          r.source === 'local'
            ? `${r.motorEnergyName} (Local)`
            : r.motorEnergyName,
        count: r.count ?? 0,
        source: r.source,
        fill: r.source === 'local' ? `${baseColor}66` : baseColor,
      };
    })
    .sort((a, b) => b.count - a.count);
}
