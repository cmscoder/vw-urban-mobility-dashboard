import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { VehicleFormDialog } from '../VehicleFormDialog';
import type { VehicleRecord } from '@/features/vehicles/types';

const existingRecord: VehicleRecord = {
  id: '1',
  country: 'DE',
  countryName: 'Germany',
  year: '2022',
  motorEnergy: 'ELC',
  motorEnergyName: 'Electricity',
  count: 5000,
  source: 'eurostat',
};

describe('VehicleFormDialog', () => {
  const onOpenChange = vi.fn();
  const onSubmit = vi.fn();

  it('shows "Add New Record" title in create mode', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Add New Record')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fill in the details to add a new vehicle registration record.'
      )
    ).toBeInTheDocument();
  });

  it('shows "Edit Record" title in edit mode', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        record={existingRecord}
      />
    );

    expect(screen.getByText('Edit Record')).toBeInTheDocument();
    expect(
      screen.getByText('Update the vehicle registration data below.')
    ).toBeInTheDocument();
  });

  it('pre-populates fields when editing an existing record', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        record={existingRecord}
      />
    );

    const combobox = screen.getByRole('combobox', { name: 'Country' });
    expect(combobox).toHaveTextContent('Germany');
    expect(combobox).toHaveTextContent('DE');
    expect(screen.getByLabelText('Year')).toHaveValue(2022);
    expect(screen.getByLabelText('Vehicle Count')).toHaveValue(5000);
  });

  it('disables submit when required fields are empty', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Add Record' });
    expect(submitButton).toBeDisabled();
  });

  it('calls onOpenChange(false) when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('allows typing into year and count inputs', async () => {
    const user = userEvent.setup();
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    );

    const year = screen.getByLabelText('Year');
    const count = screen.getByLabelText('Vehicle Count');

    await user.clear(year);
    await user.type(year, '2023');
    expect(year).toHaveValue(2023);

    await user.type(count, '999');
    expect(count).toHaveValue(999);
  });

  it('shows country combobox with placeholder when no country selected', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    );

    const combobox = screen.getByRole('combobox', { name: 'Country' });
    expect(combobox).toHaveTextContent('Select country…');
  });

  it('renders all energy options in the select', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Select energy type')).toBeInTheDocument();
  });

  it('shows "Save Changes" button text in edit mode', () => {
    render(
      <VehicleFormDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        record={existingRecord}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Save Changes' })
    ).toBeInTheDocument();
  });
});
