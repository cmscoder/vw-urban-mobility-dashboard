import type {
  VehicleRecord,
  AggregatedRecord,
} from '@/features/vehicles/types';

/**
 * Groups vehicle records by country and year, summing registration counts.
 * Used by the dashboard to produce a scannable master view.
 *
 * Grouping key uses **uppercase** ISO country codes so `de` and `DE` land in the same bucket.
 * `countryName` comes from the **first** record in each group.
 *
 * @param records - Flat list of individual vehicle records.
 * @returns One `AggregatedRecord` per unique country × year combination (insertion order).
 */
export function aggregateByCountryYear(
  records: VehicleRecord[]
): AggregatedRecord[] {
  const groups = new Map<string, AggregatedRecord>();

  for (const record of records) {
    const country = record.country.toUpperCase();
    const key = `${country}-${record.year}`;
    const existing = groups.get(key);

    if (existing) {
      existing.totalCount += record.count ?? 0;
      existing.recordCount += 1;
    } else {
      groups.set(key, {
        id: key,
        country,
        countryName: record.countryName,
        year: record.year,
        totalCount: record.count ?? 0,
        recordCount: 1,
      });
    }
  }

  return Array.from(groups.values());
}
