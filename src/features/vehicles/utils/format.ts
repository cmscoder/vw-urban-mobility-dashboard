/**
 * Formats a numeric count for display with `en-US` grouping (stable in UI and tests).
 * Returns an em-dash ("—") for `null` or non-finite numbers.
 */
export function formatCount(count: number | null): string {
  if (count === null || !Number.isFinite(count)) return '—';
  return count.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/** Badge text for how many motor-energy rows exist in a country × year group. */
export function formatMotorTypeCountLabel(recordCount: number): string {
  const noun = recordCount === 1 ? 'type' : 'types';
  return `${recordCount} motor ${noun}`;
}

/** Shared `aria-label` for table row and card "view details" actions. */
export function viewDetailsAriaLabel(record: {
  countryName: string;
  year: string;
}): string {
  return `View details for ${record.countryName} ${record.year}`;
}
