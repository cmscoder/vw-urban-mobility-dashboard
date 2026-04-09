import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from '../search-input';

describe('SearchInput', () => {
  it('renders with the correct placeholder', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(
      screen.getByPlaceholderText('Search all fields…')
    ).toBeInTheDocument();
  });

  it('accepts a custom placeholder', () => {
    render(
      <SearchInput value="" onChange={vi.fn()} placeholder="Find records" />
    );
    expect(screen.getByPlaceholderText('Find records')).toBeInTheDocument();
  });

  it('has an accessible label', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Search records')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    await user.type(screen.getByLabelText('Search records'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('shows clear button when value is not empty', () => {
    render(<SearchInput value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput value="test" onChange={onChange} />);

    await user.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
