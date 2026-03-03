import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {QuantitySelector} from './QuantitySelector';

describe('QuantitySelector', () => {
  it('renders with the provided value', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('spinbutton')).toHaveValue(3);
  });

  it('renders with value 0', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  });

  it('calls onChange with incremented value when "+" is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} productName="Test Soap" />);
    await user.click(screen.getByRole('button', {name: /increase quantity of test soap/i}));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with decremented value when "-" is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} productName="Test Soap" />);
    await user.click(screen.getByRole('button', {name: /decrease quantity of test soap/i}));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('does not call onChange when "-" is clicked and value is 0', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={0} onChange={onChange} productName="Test Soap" />);
    await user.click(screen.getByRole('button', {name: /decrease quantity of test soap/i}));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('"-" button is disabled when value is 0', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('button', {name: /decrease quantity of test soap/i})).toBeDisabled();
  });

  it('"-" button is not disabled when value is > 0', () => {
    render(<QuantitySelector value={1} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('button', {name: /decrease quantity of test soap/i})).not.toBeDisabled();
  });

  it('calls onChange when a valid number is typed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={0} onChange={onChange} productName="Test Soap" />);
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '12');
    expect(onChange).toHaveBeenLastCalledWith(12);
  });

  it('input has aria-label including product name', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Lavender Soap" />);
    expect(
      screen.getByRole('spinbutton', {name: /quantity of lavender soap/i}),
    ).toBeInTheDocument();
  });

  it('"+" button has aria-label including product name', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Lavender Soap" />);
    expect(
      screen.getByRole('button', {name: /increase quantity of lavender soap/i}),
    ).toBeInTheDocument();
  });

  it('"-" button has aria-label including product name', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Lavender Soap" />);
    expect(
      screen.getByRole('button', {name: /decrease quantity of lavender soap/i}),
    ).toBeInTheDocument();
  });

  it('all controls are disabled when disabled prop is true', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" disabled />);
    expect(screen.getByRole('button', {name: /increase quantity of test soap/i})).toBeDisabled();
    expect(screen.getByRole('button', {name: /decrease quantity of test soap/i})).toBeDisabled();
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('"+" button is not disabled by default', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('button', {name: /increase quantity of test soap/i})).not.toBeDisabled();
  });

  it('input min is 0', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('min', '0');
  });

  it('group has aria-disabled="true" when disabled prop is true', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" disabled />);
    expect(
      screen.getByRole('group', {name: /quantity for test soap/i}),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('group does not have aria-disabled when disabled prop is false', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    expect(
      screen.getByRole('group', {name: /quantity for test soap/i}),
    ).not.toHaveAttribute('aria-disabled', 'true');
  });
});

describe('QuantitySelector MOQ validation', () => {
  it('shows no validation error initially', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });

  it('shows error message when quantity is between 1 and 5 on blur', async () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();
  });

  it('shows error message when quantity is 1 on blur', () => {
    render(<QuantitySelector value={1} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();
  });

  it('shows error message when quantity is 5 on blur', () => {
    render(<QuantitySelector value={5} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();
  });

  it('does not show error message when quantity is 0 on blur', () => {
    render(<QuantitySelector value={0} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });

  it('does not show error message when quantity is 6 on blur', () => {
    render(<QuantitySelector value={6} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });

  it('shows red border on input when quantity is invalid', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByRole('spinbutton')).toHaveClass('border-red-500');
  });

  it('input has aria-invalid true when quantity is invalid', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('input does not have aria-invalid when quantity is valid', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('error message container has aria-live polite', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} productName="Test Soap" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('clears error immediately when quantity changes from invalid to 0 via typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const {rerender} = render(
      <QuantitySelector value={3} onChange={onChange} productName="Test Soap" />,
    );
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();

    // Simulate parent updating value to 0 after onChange is called
    rerender(<QuantitySelector value={0} onChange={onChange} productName="Test Soap" />);
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });

  it('clears error immediately when quantity changes from invalid to 6 via typing', async () => {
    const onChange = vi.fn();
    const {rerender} = render(
      <QuantitySelector value={3} onChange={onChange} productName="Test Soap" />,
    );
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();

    rerender(<QuantitySelector value={6} onChange={onChange} productName="Test Soap" />);
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });

  it('clears error when decrement button takes quantity from 1 to 0', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const {rerender} = render(
      <QuantitySelector value={1} onChange={onChange} productName="Test Soap" />,
    );
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /decrease quantity of test soap/i}));
    rerender(<QuantitySelector value={0} onChange={onChange} productName="Test Soap" />);
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });

  it('clears error when increment button takes quantity from 5 to 6', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const {rerender} = render(
      <QuantitySelector value={5} onChange={onChange} productName="Test Soap" />,
    );
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText(/minimum order is 6 units/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /increase quantity of test soap/i}));
    rerender(<QuantitySelector value={6} onChange={onChange} productName="Test Soap" />);
    expect(screen.queryByText(/minimum order is 6 units/i)).not.toBeInTheDocument();
  });
});
