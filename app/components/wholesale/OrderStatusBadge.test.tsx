import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {OrderStatusBadge} from './OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('displays "Fulfilled" for FULFILLED status', () => {
    render(<OrderStatusBadge status="FULFILLED" />);
    expect(screen.getByText('Fulfilled')).toBeInTheDocument();
  });

  it('displays "Processing" for UNFULFILLED status', () => {
    render(<OrderStatusBadge status="UNFULFILLED" />);
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('displays "Partially Fulfilled" for PARTIALLY_FULFILLED status', () => {
    render(<OrderStatusBadge status="PARTIALLY_FULFILLED" />);
    expect(screen.getByText('Partially Fulfilled')).toBeInTheDocument();
  });

  it('displays "Scheduled" for SCHEDULED status', () => {
    render(<OrderStatusBadge status="SCHEDULED" />);
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });

  it('displays raw status for unknown status', () => {
    render(<OrderStatusBadge status="CUSTOM_STATUS" />);
    expect(screen.getByText('CUSTOM_STATUS')).toBeInTheDocument();
  });

  it('applies success variant styling for FULFILLED status', () => {
    render(<OrderStatusBadge status="FULFILLED" />);
    const badge = screen.getByText('Fulfilled');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('applies default variant styling for non-FULFILLED status', () => {
    render(<OrderStatusBadge status="UNFULFILLED" />);
    const badge = screen.getByText('Processing');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });
});
