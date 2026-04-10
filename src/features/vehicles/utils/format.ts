export function formatCount(count: number | null): string {
  if (count === null) return '—';
  return count.toLocaleString('en-US');
}
