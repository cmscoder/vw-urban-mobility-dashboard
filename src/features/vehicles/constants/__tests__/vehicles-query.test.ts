import { describe, it, expect } from 'vitest';
import { stableEurostatParamsKey, vehiclesQueryKey } from '../vehicles-query';

describe('stableEurostatParamsKey', () => {
  it('treats undefined and empty object as the same root key', () => {
    expect(stableEurostatParamsKey(undefined)).toBe(
      stableEurostatParamsKey({})
    );
  });

  it('matches for different object references with the same fields', () => {
    const a = { geoLevel: 'country' as const, sinceTimePeriod: '2018' };
    const b = { sinceTimePeriod: '2018', geoLevel: 'country' as const };
    expect(stableEurostatParamsKey(a)).toBe(stableEurostatParamsKey(b));
  });

  it('differs when a param value changes', () => {
    expect(stableEurostatParamsKey({ sinceTimePeriod: '2018' })).not.toBe(
      stableEurostatParamsKey({ sinceTimePeriod: '2019' })
    );
  });
});

describe('vehiclesQueryKey', () => {
  it('includes stable params segment', () => {
    expect(vehiclesQueryKey()).toEqual(['vehicles', '']);
    expect(vehiclesQueryKey({ lang: 'EN' })).toEqual([
      'vehicles',
      '{"lang":"EN"}',
    ]);
  });
});
