/**
 * Formats a numeric count for display with locale-aware thousand separators.
 * Returns an em-dash ("—") for null values.
 */
export function formatCount(count: number | null): string {
  if (count === null) return '—';
  return count.toLocaleString('en-US');
}
