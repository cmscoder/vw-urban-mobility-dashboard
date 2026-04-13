import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TablePagination } from '../TablePagination';
import type { PaginationInfo } from '@/features/vehicles/types';

function createPagination(
  overrides: Partial<PaginationInfo> = {}
): PaginationInfo {
  return {
    pageIndex: 0,
    pageSize: 20,
    pageCount: 5,
    filteredTotal: 100,
    canPreviousPage: false,
    canNextPage: true,
    goToFirstPage: vi.fn(),
    goToPreviousPage: vi.fn(),
    goToNextPage: vi.fn(),
    goToLastPage: vi.fn(),
    setPageSize: vi.fn(),
    ...overrides,
  };
}

describe('TablePagination', () => {
  it('displays the correct range text', () => {
    render(<TablePagination pagination={createPagination()} />);
    expect(screen.getByText('1–20 of 100')).toBeInTheDocument();
  });

  it('displays range for a middle page', () => {
    render(
      <TablePagination
        pagination={createPagination({
          pageIndex: 2,
          filteredTotal: 100,
        })}
      />
    );
    expect(screen.getByText('41–60 of 100')).toBeInTheDocument();
  });

  it('displays "0 results" when filteredTotal is zero', () => {
    render(
      <TablePagination pagination={createPagination({ filteredTotal: 0 })} />
    );
    expect(screen.getByText('0 results')).toBeInTheDocument();
  });

  it('disables Previous and First when canPreviousPage is false', () => {
    render(
      <TablePagination
        pagination={createPagination({ canPreviousPage: false })}
      />
    );
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('First page')).toBeDisabled();
  });

  it('disables Next and Last when canNextPage is false', () => {
    render(
      <TablePagination pagination={createPagination({ canNextPage: false })} />
    );
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Last page')).toBeDisabled();
  });

  it('calls goToNextPage when Next is clicked', async () => {
    const user = userEvent.setup();
    const goToNextPage = vi.fn();
    render(<TablePagination pagination={createPagination({ goToNextPage })} />);

    await user.click(screen.getByLabelText('Next page'));
    expect(goToNextPage).toHaveBeenCalledOnce();
  });

  it('calls goToPreviousPage when Previous is clicked', async () => {
    const user = userEvent.setup();
    const goToPreviousPage = vi.fn();
    render(
      <TablePagination
        pagination={createPagination({
          canPreviousPage: true,
          goToPreviousPage,
        })}
      />
    );

    await user.click(screen.getByLabelText('Previous page'));
    expect(goToPreviousPage).toHaveBeenCalledOnce();
  });

  it('calls goToFirstPage when First is clicked', async () => {
    const user = userEvent.setup();
    const goToFirstPage = vi.fn();
    render(
      <TablePagination
        pagination={createPagination({
          canPreviousPage: true,
          goToFirstPage,
        })}
      />
    );

    await user.click(screen.getByLabelText('First page'));
    expect(goToFirstPage).toHaveBeenCalledOnce();
  });

  it('calls goToLastPage when Last is clicked', async () => {
    const user = userEvent.setup();
    const goToLastPage = vi.fn();
    render(<TablePagination pagination={createPagination({ goToLastPage })} />);

    await user.click(screen.getByLabelText('Last page'));
    expect(goToLastPage).toHaveBeenCalledOnce();
  });

  it('calls setPageSize when a page size option is selected', async () => {
    const user = userEvent.setup();
    const setPageSize = vi.fn();
    render(<TablePagination pagination={createPagination({ setPageSize })} />);

    await user.click(screen.getByLabelText('Rows per page'));
    const option = await screen.findByRole('option', { name: '50' });
    await user.click(option);

    expect(setPageSize).toHaveBeenCalledWith(50);
  });
});
