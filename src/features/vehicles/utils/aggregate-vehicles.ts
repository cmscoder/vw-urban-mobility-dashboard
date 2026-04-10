import type {
  VehicleRecord,
  AggregatedRecord,
} from '@/features/vehicles/types';

export function aggregateByCountryYear(
  records: VehicleRecord[]
): AggregatedRecord[] {
  const groups = new Map<string, AggregatedRecord>();

  for (const record of records) {
    const key = `${record.country}-${record.year}`;
    const existing = groups.get(key);

    if (existing) {
      existing.totalCount += record.count ?? 0;
      existing.recordCount += 1;
    } else {
      groups.set(key, {
        id: key,
        country: record.country,
        countryName: record.countryName,
        year: record.year,
        totalCount: record.count ?? 0,
        recordCount: 1,
      });
    }
  }

  return Array.from(groups.values());
}
