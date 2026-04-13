import { CHART_COLORS } from '@/features/vehicles/constants';
import type { VehicleRecord } from '@/features/vehicles/types';

/** Data point consumed by Recharts bar and pie charts. */
export interface ChartDataEntry {
  name: string;
  count: number;
  fill: string;
}

/**
 * Merges vehicle rows by `motorEnergyName`, sums counts, assigns a stable color per
 * motor type (order of first appearance in `records`), then sorts descending by count.
 *
 * @param records - Vehicle records for a single country × year.
 */
export function buildChartData(records: VehicleRecord[]): ChartDataEntry[] {
  const totals = records.reduce((map, r) => {
    const name = r.motorEnergyName;
    map.set(name, (map.get(name) ?? 0) + (r.count ?? 0));
    return map;
  }, new Map<string, number>());

  const orderedNames = [...new Set(records.map((r) => r.motorEnergyName))];

  return orderedNames
    .map((name, colorIndex) => ({
      name,
      count: totals.get(name) ?? 0,
      fill: CHART_COLORS[colorIndex % CHART_COLORS.length],
    }))
    .sort((a, b) => b.count - a.count);
}
