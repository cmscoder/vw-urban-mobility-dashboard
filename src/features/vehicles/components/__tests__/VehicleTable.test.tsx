import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { VehicleTable } from '../VehicleTable';
import { EMPTY_FILTERS } from '@/features/vehicles/constants';
import type { Row } from '@tanstack/react-table';
import type { AggregatedRecord } from '@/features/vehicles/types';

const mockRecords: AggregatedRecord[] = [
  {
    id: 'DE-2022',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
    totalCount: 12345,
    recordCount: 3,
  },
  {
    id: 'FR-2023',
    country: 'FR',
    countryName: 'France',
    year: '2023',
    totalCount: 0,
    recordCount: 2,
  },
];

function toRows(records: AggregatedRecord[]): Row<AggregatedRecord>[] {
  return records.map(
    (record, i) =>
      ({ id: String(i), original: record }) as Row<AggregatedRecord>
  );
}

const mockRows = toRows(mockRecords);

const mockPagination = {
  pageIndex: 0,
  pageSize: 20,
  pageCount: 1,
  filteredTotal: 2,
  canPreviousPage: false,
  canNextPage: false,
  goToFirstPage: vi.fn(),
  goToPreviousPage: vi.fn(),
  goToNextPage: vi.fn(),
  goToLastPage: vi.fn(),
  setPageSize: vi.fn(),
};

const defaultProps = {
  filters: EMPTY_FILTERS,
  searchQuery: '',
  onSearchChange: vi.fn(),
  countryOptions: [
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
  ],
  yearOptions: [
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ],
  hasActiveFilters: false,
  activeFilterCount: 0,
  onFilterChange: vi.fn(),
  onFiltersClear: vi.fn(),
  pagination: mockPagination,
  onViewDetails: vi.fn(),
};

function renderDesktop(ui: React.ReactElement) {
  const result = render(ui);
  const desktop = within(screen.getByTestId('desktop-view'));
  return { ...result, desktop };
}

function renderMobile(ui: React.ReactElement) {
  const result = render(ui);
  const mobile = within(screen.getByTestId('mobile-view'));
  return { ...result, mobile };
}

describe('VehicleTable — Desktop', () => {
  it('renders filter controls in the column headers', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={[]} isLoading={false} />
    );

    expect(desktop.getByLabelText('Filter by country')).toBeInTheDocument();
    expect(desktop.getByLabelText('Filter by year')).toBeInTheDocument();
  });

  it('renders static column headers (Country, Year, Total Count, Motor Types)', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(desktop.getByText('Country')).toBeInTheDocument();
    expect(desktop.getByText('Year')).toBeInTheDocument();
    expect(desktop.getByText('Total Count')).toBeInTheDocument();
    expect(desktop.getByText('Motor Types')).toBeInTheDocument();
  });

  it('shows empty state when no records exist', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={[]} isLoading={false} />
    );

    expect(desktop.getByText('No records found.')).toBeInTheDocument();
  });

  it('renders loading skeletons when isLoading is true', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={[]} isLoading={true} />
    );

    const skeletons = desktop.queryAllByRole('row');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('renders aggregated records with formatted data', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(desktop.getByText('Germany')).toBeInTheDocument();
    expect(desktop.getByText('2022')).toBeInTheDocument();
    expect(desktop.getByText('12,345')).toBeInTheDocument();
    expect(desktop.getByText('3 motor types')).toBeInTheDocument();

    expect(desktop.getByText('France')).toBeInTheDocument();
    expect(desktop.getByText('2023')).toBeInTheDocument();
    expect(desktop.getByText('2 motor types')).toBeInTheDocument();
  });

  it('renders View Details button for each row', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(
      desktop.getByLabelText('View details for Germany 2022')
    ).toBeInTheDocument();
    expect(
      desktop.getByLabelText('View details for France 2023')
    ).toBeInTheDocument();
  });

  it('calls onViewDetails when View Details is clicked', async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();

    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={toRows([mockRecords[0]])}
        isLoading={false}
        onViewDetails={onViewDetails}
      />
    );

    await user.click(desktop.getByLabelText('View details for Germany 2022'));
    expect(onViewDetails).toHaveBeenCalledWith(mockRecords[0]);
  });

  it('shows Clear button when hasActiveFilters is true', () => {
    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        hasActiveFilters={true}
        activeFilterCount={1}
        isLoading={false}
      />
    );

    expect(desktop.getByLabelText('Clear all filters')).toBeInTheDocument();
  });

  it('calls onFiltersClear when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onFiltersClear = vi.fn();

    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        hasActiveFilters={true}
        activeFilterCount={1}
        onFiltersClear={onFiltersClear}
        isLoading={false}
      />
    );

    await user.click(desktop.getByLabelText('Clear all filters'));
    expect(onFiltersClear).toHaveBeenCalled();
  });

  it('calls onFilterChange when a country is selected via header popover', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        onFilterChange={onFilterChange}
        isLoading={false}
      />
    );

    await user.click(desktop.getByLabelText('Filter by country'));
    const option = await screen.findByRole('button', { name: 'Germany' });
    await user.click(option);

    expect(onFilterChange).toHaveBeenCalledWith('country', 'DE');
  });

  it('renders a search input', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(desktop.getByLabelText('Search records')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in the search input', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        onSearchChange={onSearchChange}
        isLoading={false}
      />
    );

    const searchInput = desktop.getByLabelText('Search records');
    await user.type(searchInput, 'Germany');

    expect(onSearchChange).toHaveBeenCalled();
  });

  it('shows a clear button when searchQuery has a value', () => {
    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        searchQuery="test"
        isLoading={false}
      />
    );

    expect(desktop.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('renders pagination controls when there are rows', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(desktop.getByLabelText('First page')).toBeInTheDocument();
    expect(desktop.getByLabelText('Previous page')).toBeInTheDocument();
    expect(desktop.getByLabelText('Next page')).toBeInTheDocument();
    expect(desktop.getByLabelText('Last page')).toBeInTheDocument();
    expect(desktop.getByLabelText('Rows per page')).toBeInTheDocument();
  });

  it('does not render pagination when there are no rows', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={[]} isLoading={false} />
    );

    expect(desktop.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  it('shows range text in pagination', () => {
    const { desktop } = renderDesktop(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(desktop.getByText('1–2 of 2')).toBeInTheDocument();
  });

  it('calls goToNextPage when Next is clicked', async () => {
    const user = userEvent.setup();
    const goToNextPage = vi.fn();
    const paginationWithNext = {
      ...mockPagination,
      canNextPage: true,
      pageCount: 3,
      filteredTotal: 50,
      goToNextPage,
    };

    const { desktop } = renderDesktop(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        pagination={paginationWithNext}
        isLoading={false}
      />
    );

    await user.click(desktop.getByLabelText('Next page'));
    expect(goToNextPage).toHaveBeenCalled();
  });
});

describe('VehicleTable — Mobile', () => {
  it('shows a Filters button that opens the bottom sheet', async () => {
    const user = userEvent.setup();
    const { mobile } = renderMobile(
      <VehicleTable {...defaultProps} rows={[]} isLoading={false} />
    );

    const filtersBtn = mobile.getByRole('button', { name: /filters/i });
    expect(filtersBtn).toBeInTheDocument();

    await user.click(filtersBtn);

    expect(
      await screen.findByText('Narrow down and order the vehicle records.')
    ).toBeInTheDocument();
  });

  it('displays active filter count badge on the trigger', () => {
    const { mobile } = renderMobile(
      <VehicleTable
        {...defaultProps}
        rows={mockRows}
        activeFilterCount={2}
        hasActiveFilters={true}
        isLoading={false}
      />
    );

    expect(mobile.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when no records exist', () => {
    const { mobile } = renderMobile(
      <VehicleTable {...defaultProps} rows={[]} isLoading={false} />
    );

    expect(mobile.getByText('No records found.')).toBeInTheDocument();
  });

  it('renders aggregated cards with record data', () => {
    const { mobile } = renderMobile(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(mobile.getByText('Germany')).toBeInTheDocument();
    expect(mobile.getByText('France')).toBeInTheDocument();
    expect(mobile.getByText('12,345')).toBeInTheDocument();
    expect(mobile.getByText('3 motor types')).toBeInTheDocument();
  });

  it('renders View Details buttons on mobile cards', () => {
    const { mobile } = renderMobile(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(
      mobile.getByLabelText('View details for Germany 2022')
    ).toBeInTheDocument();
    expect(
      mobile.getByLabelText('View details for France 2023')
    ).toBeInTheDocument();
  });

  it('calls onViewDetails from a mobile card', async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();

    const { mobile } = renderMobile(
      <VehicleTable
        {...defaultProps}
        rows={toRows([mockRecords[0]])}
        isLoading={false}
        onViewDetails={onViewDetails}
      />
    );

    await user.click(mobile.getByLabelText('View details for Germany 2022'));
    expect(onViewDetails).toHaveBeenCalledWith(mockRecords[0]);
  });

  it('renders a search input', () => {
    const { mobile } = renderMobile(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(mobile.getByLabelText('Search records')).toBeInTheDocument();
  });

  it('renders search input next to the filters button', () => {
    const { mobile } = renderMobile(
      <VehicleTable {...defaultProps} rows={mockRows} isLoading={false} />
    );

    expect(mobile.getByLabelText('Search records')).toBeInTheDocument();
    expect(
      mobile.getByRole('button', { name: /filters/i })
    ).toBeInTheDocument();
  });
});
