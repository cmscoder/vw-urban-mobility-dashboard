import { describe, it, expect } from 'vitest';
import { MOTOR_ENERGY_OPTIONS } from '../motor-energy';

describe('MOTOR_ENERGY_OPTIONS', () => {
  it('contains all six energy types', () => {
    expect(MOTOR_ENERGY_OPTIONS).toHaveLength(6);
  });

  it('has unique values', () => {
    const values = MOTOR_ENERGY_OPTIONS.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('includes the core electric and hybrid types', () => {
    const values = MOTOR_ENERGY_OPTIONS.map((o) => o.value);
    expect(values).toContain('ELC');
    expect(values).toContain('ELC_PET_HYB');
    expect(values).toContain('ELC_DIE_HYB');
    expect(values).toContain('ELC_PET_PI');
    expect(values).toContain('ELC_DIE_PI');
    expect(values).toContain('HYD_FCELL');
  });

  it('every option has a non-empty label', () => {
    for (const option of MOTOR_ENERGY_OPTIONS) {
      expect(option.label.length).toBeGreaterThan(0);
    }
  });
});
