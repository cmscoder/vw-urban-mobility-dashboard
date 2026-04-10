import { CHART_COLORS } from '@/features/vehicles/constants';
import type { VehicleRecord } from '@/features/vehicles/types';

/** Data point consumed by Recharts bar and pie charts. */
export interface ChartDataEntry {
  name: string;
  count: number;
  source: 'eurostat' | 'local';
  fill: string;
}

/**
 * Transforms vehicle records into chart-ready data entries.
 * Local records receive a faded fill color and a "(Local)" label suffix
 * so users can visually distinguish user-modified data from Eurostat originals.
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
