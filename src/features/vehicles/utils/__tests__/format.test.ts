import { describe, it, expect } from 'vitest';
import {
  formatCount,
  formatMotorTypeCountLabel,
  viewDetailsAriaLabel,
} from '../format';

describe('formatCount', () => {
  it('returns em dash for null', () => {
    expect(formatCount(null)).toBe('—');
  });

  it('formats integers with locale separators', () => {
    expect(formatCount(1234)).toBe('1,234');
  });

  it('formats zero', () => {
    expect(formatCount(0)).toBe('0');
  });

  it('returns em dash for non-finite numbers', () => {
    expect(formatCount(Number.NaN)).toBe('—');
    expect(formatCount(Number.POSITIVE_INFINITY)).toBe('—');
  });
});

describe('formatMotorTypeCountLabel', () => {
  it('uses singular for 1', () => {
    expect(formatMotorTypeCountLabel(1)).toBe('1 motor type');
  });

  it('uses plural otherwise', () => {
    expect(formatMotorTypeCountLabel(0)).toBe('0 motor types');
    expect(formatMotorTypeCountLabel(3)).toBe('3 motor types');
  });
});

describe('viewDetailsAriaLabel', () => {
  it('includes country and year', () => {
    expect(viewDetailsAriaLabel({ countryName: 'Germany', year: '2022' })).toBe(
      'View details for Germany 2022'
    );
  });
});
