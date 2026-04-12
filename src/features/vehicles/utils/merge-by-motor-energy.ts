import { CHART_COLORS } from '@/features/vehicles/constants';
import type { VehicleRecord } from '@/features/vehicles/types';

/** Data point consumed by Recharts bar and pie charts. */
export interface ChartDataEntry {
  name: string;
  count: number;
  fill: string;
}

/**
 * Transforms vehicle records into chart-ready data entries.
 * Assigns a consistent color per motor energy type.
 *
 * @param records - Vehicle records for a single country × year.
 * @returns Sorted array (descending by count) of {@link ChartDataEntry}.
 */
export function buildChartData(records: VehicleRecord[]): ChartDataEntry[] {
  const motorTypes = [...new Set(records.map((r) => r.motorEnergyName))];

  return records
    .map((r) => {
      const colorIndex = motorTypes.indexOf(r.motorEnergyName);
      const baseColor = CHART_COLORS[colorIndex % CHART_COLORS.length];

      return {
        name: r.motorEnergyName,
        count: r.count ?? 0,
        fill: baseColor,
      };
    })
    .sort((a, b) => b.count - a.count);
}
