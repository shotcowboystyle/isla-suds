import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {LastOrder} from './LastOrder';

// Mock useFetcher from react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useFetcher: () => ({
      state: 'idle',
      data: null,
      Form: ({children, ...props}: any) => <form {...props}>{children}</form>,
    }),
  };
});

describe('LastOrder', () => {
  it('shows no orders message when order is null', () => {
    render(<LastOrder order={null} />);

    expect(screen.getByText(/No orders yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to stock up/i)).toBeInTheDocument();
  });

  it('displays order date formatted correctly', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText(/Dec 15, 2025/i)).toBeInTheDocument();
  });

  it('displays order total formatted as currency', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText('$324.00')).toBeInTheDocument();
  });

  it('displays order status badge', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText('Fulfilled')).toBeInTheDocument();
  });

  it('displays line items with quantities', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [
          {
            node: {
              id: 'line-1',
              title: 'Lavender Soap',
              quantity: 12,
              variant: {
                id: 'variant-1',
                title: 'Regular',
              },
            },
          },
          {
            node: {
              id: 'line-2',
              title: 'Lemongrass Soap',
              quantity: 12,
              variant: null,
            },
          },
        ],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText('12x Lavender Soap - Regular')).toBeInTheDocument();
    expect(screen.getByText('12x Lemongrass Soap')).toBeInTheDocument();
  });

  it('truncates line items when more than 4 items', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [
          {node: {id: '1', title: 'Item 1', quantity: 1, variant: null}},
          {node: {id: '2', title: 'Item 2', quantity: 2, variant: null}},
          {node: {id: '3', title: 'Item 3', quantity: 3, variant: null}},
          {node: {id: '4', title: 'Item 4', quantity: 4, variant: null}},
          {node: {id: '5', title: 'Item 5', quantity: 5, variant: null}},
          {node: {id: '6', title: 'Item 6', quantity: 6, variant: null}},
        ],
      },
    };

    render(<LastOrder order={mockOrder} />);

    // Should show first 4 items
    expect(screen.getByText('1x Item 1')).toBeInTheDocument();
    expect(screen.getByText('2x Item 2')).toBeInTheDocument();
    expect(screen.getByText('3x Item 3')).toBeInTheDocument();
    expect(screen.getByText('4x Item 4')).toBeInTheDocument();

    // Should NOT show items 5 and 6
    expect(screen.queryByText('5x Item 5')).not.toBeInTheDocument();
    expect(screen.queryByText('6x Item 6')).not.toBeInTheDocument();

    // Should show "+2 more items" message
    expect(screen.getByText('+2 more items')).toBeInTheDocument();
  });

  it('handles malformed date gracefully', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: 'invalid-date',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText('Recent order')).toBeInTheDocument();
  });

  it('handles malformed currency gracefully', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: 'not-a-number',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText('See order details')).toBeInTheDocument();
  });

  it('handles missing currentTotalPrice gracefully', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'FULFILLED',
      currentTotalPrice: {
        amount: '',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    expect(screen.getByText('See order details')).toBeInTheDocument();
  });

  it('handles unknown order status with fallback', () => {
    const mockOrder = {
      id: 'order-123',
      name: '#1001',
      processedAt: '2025-12-15T10:00:00Z',
      fulfillmentStatus: 'UNKNOWN_STATUS',
      currentTotalPrice: {
        amount: '324.00',
        currencyCode: 'USD',
      },
      lineItems: {
        edges: [],
      },
    };

    render(<LastOrder order={mockOrder} />);

    // OrderStatusBadge should display the raw status as fallback
    expect(screen.getByText('UNKNOWN_STATUS')).toBeInTheDocument();
  });

  // Reorder functionality tests (Story 7.6)
  describe('Reorder functionality', () => {
    it('displays Reorder button when order exists', () => {
      const mockOrder = {
        id: 'order-123',
        name: '#1001',
        processedAt: '2025-12-15T10:00:00Z',
        fulfillmentStatus: 'FULFILLED',
        currentTotalPrice: {
          amount: '324.00',
          currencyCode: 'USD',
        },
        lineItems: {
          edges: [
            {
              node: {
                id: 'line-1',
                title: 'Lavender Soap',
                quantity: 12,
                variant: {
                  id: 'gid://shopify/ProductVariant/123',
                  title: 'Regular',
                },
              },
            },
          ],
        },
      };

      render(<LastOrder order={mockOrder} />);

      expect(screen.getByRole('button', {name: /reorder/i})).toBeInTheDocument();
    });

    it('does not display Reorder button when no order exists', () => {
      render(<LastOrder order={null} />);

      expect(screen.queryByRole('button', {name: /reorder/i})).not.toBeInTheDocument();
    });

    it('button is enabled by default', () => {
      const mockOrder = {
        id: 'order-123',
        name: '#1001',
        processedAt: '2025-12-15T10:00:00Z',
        fulfillmentStatus: 'FULFILLED',
        currentTotalPrice: {
          amount: '324.00',
          currencyCode: 'USD',
        },
        lineItems: {
          edges: [
            {
              node: {
                id: 'line-1',
                title: 'Lavender Soap',
                quantity: 12,
                variant: {
                  id: 'gid://shopify/ProductVariant/123',
                  title: 'Regular',
                },
              },
            },
          ],
        },
      };

      render(<LastOrder order={mockOrder} />);

      const button = screen.getByRole('button', {name: /reorder/i});
      expect(button).not.toBeDisabled();
    });
  });
});
