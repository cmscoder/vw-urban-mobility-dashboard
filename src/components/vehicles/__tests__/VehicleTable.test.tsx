import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { VehicleTable } from '../VehicleTable';
import type { VehicleRecord } from '@/types';

const mockRecords: VehicleRecord[] = [
  {
    id: '1',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
    motorEnergy: 'ELC',
    motorEnergyName: 'Electric',
    count: 12345,
    source: 'eurostat',
  },
  {
    id: '2',
    country: 'FR',
    countryName: 'France',
    year: '2023',
    motorEnergy: 'ELC_PET_HYB',
    motorEnergyName: 'Hybrid Electric-Petrol',
    count: null,
    source: 'local',
  },
];

describe('VehicleTable', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  it('renders column headers', () => {
    render(
      <VehicleTable
        vehicles={[]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Motor Energy')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
  });

  it('shows empty state when no records exist', () => {
    render(
      <VehicleTable
        vehicles={[]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('No records found.')).toBeInTheDocument();
  });

  it('renders loading skeletons when isLoading is true', () => {
    const { container } = render(
      <VehicleTable
        vehicles={[]}
        isLoading={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders vehicle records with formatted data', () => {
    render(
      <VehicleTable
        vehicles={mockRecords}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('12,345')).toBeInTheDocument();
    expect(screen.getByText('Eurostat')).toBeInTheDocument();

    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('Hybrid Electric-Petrol')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Local')).toBeInTheDocument();
  });

  it('calls onEdit when Edit is clicked in the dropdown', async () => {
    const user = userEvent.setup();

    render(
      <VehicleTable
        vehicles={[mockRecords[0]]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const trigger = screen.getByRole('button', { name: /actions/i });
    await user.click(trigger);

    const editItem = await screen.findByText('Edit');
    await user.click(editItem);

    expect(onEdit).toHaveBeenCalledWith(mockRecords[0]);
  });

  it('calls onDelete when Delete is clicked in the dropdown', async () => {
    const user = userEvent.setup();

    render(
      <VehicleTable
        vehicles={[mockRecords[0]]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const trigger = screen.getByRole('button', { name: /actions/i });
    await user.click(trigger);

    const deleteItem = await screen.findByText('Delete');
    await user.click(deleteItem);

    expect(onDelete).toHaveBeenCalledWith(mockRecords[0]);
  });
});
