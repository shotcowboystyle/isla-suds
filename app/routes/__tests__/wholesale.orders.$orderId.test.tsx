/**
 * Wholesale Order Details Integration Tests
 *
 * Tests the individual order details page including:
 * - Order information display
 * - Line items with quantities
 * - Order summary (subtotal, shipping, tax, total)
 * - Shipping address
 * - Authentication verification
 * - 404 handling for invalid order IDs
 *
 * Story: 7.7
 */

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {createRoutesStub} from 'react-router';
import OrderDetailsPage, {loader} from '~/routes/wholesale.orders.$orderId';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

// Use simple order ID for testing
const TEST_ORDER_ID = 'order-1';

describe('Order Details Route', () => {
  const mockOrderData = {
    data: {
      order: {
        id: 'gid://shopify/Order/1',
        name: '#1001',
        orderNumber: '1001',
        processedAt: '2026-01-15T10:30:00Z',
        financialStatus: 'PAID',
        fulfillmentStatus: 'FULFILLED',
        currentTotalPrice: {
          amount: '150.00',
          currencyCode: 'USD',
        },
        subtotalPrice: {
          amount: '130.00',
          currencyCode: 'USD',
        },
        totalTax: {
          amount: '10.00',
          currencyCode: 'USD',
        },
        shippingCost: {
          amount: '10.00',
          currencyCode: 'USD',
        },
        lineItems: {
          edges: [
            {
              node: {
                id: 'gid://shopify/LineItem/1',
                title: 'Lavender Soap',
                quantity: 2,
                variant: {
                  id: 'gid://shopify/ProductVariant/1',
                  title: 'Default',
                  image: {
                    url: 'https://cdn.shopify.com/image.jpg',
                    altText: 'Lavender Soap',
                  },
                },
                originalTotalPrice: {
                  amount: '100.00',
                  currencyCode: 'USD',
                },
                discountedTotalPrice: {
                  amount: '90.00',
                  currencyCode: 'USD',
                },
              },
            },
            {
              node: {
                id: 'gid://shopify/LineItem/2',
                title: 'Eucalyptus Soap',
                quantity: 1,
                variant: {
                  id: 'gid://shopify/ProductVariant/2',
                  title: 'Default',
                  image: {
                    url: 'https://cdn.shopify.com/image2.jpg',
                    altText: 'Eucalyptus Soap',
                  },
                },
                originalTotalPrice: {
                  amount: '40.00',
                  currencyCode: 'USD',
                },
                discountedTotalPrice: {
                  amount: '40.00',
                  currencyCode: 'USD',
                },
              },
            },
          ],
        },
        shippingAddress: {
          formatted: ['123 Main St', 'Anytown, CA 12345', 'United States'],
        },
      },
    },
  };

  const mockContext = {
    session: {
      get: vi.fn().mockResolvedValue('customer-123'),
    },
    customerAccount: {
      query: vi.fn().mockResolvedValue(mockOrderData),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loader: Authentication and data fetching', () => {
    it('redirects to login when not authenticated', async () => {
      const contextWithoutSession = {
        ...mockContext,
        session: {
          get: vi.fn().mockResolvedValue(null),
        },
      };

      const loaderArgs = {
        context: contextWithoutSession,
        request: new Request(`http://localhost/wholesale/orders/${TEST_ORDER_ID}`),
        params: {orderId: TEST_ORDER_ID},
      };

      const result = await loader(loaderArgs as any);

      expect(result).toHaveProperty('status', 302);
      expect(result.headers?.get('Location')).toBe(WHOLESALE_ROUTES.LOGIN);
    });

    it('fetches order details by ID', async () => {
      const loaderArgs = {
        context: mockContext,
        request: new Request(`http://localhost/wholesale/orders/${TEST_ORDER_ID}`),
        params: {orderId: TEST_ORDER_ID},
      };

      await loader(loaderArgs as any);

      expect(mockContext.customerAccount.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          variables: expect.objectContaining({
            orderId: TEST_ORDER_ID,
          }),
        }),
      );
    });

    it('returns order data', async () => {
      const loaderArgs = {
        context: mockContext,
        request: new Request(`http://localhost/wholesale/orders/${TEST_ORDER_ID}`),
        params: {orderId: TEST_ORDER_ID},
      };

      const result = await loader(loaderArgs as any);

      expect(result).toEqual({order: mockOrderData.data.order});
    });

    it('throws 404 when order not found', async () => {
      const contextWithNoOrder = {
        ...mockContext,
        customerAccount: {
          query: vi.fn().mockResolvedValue({data: {order: null}}),
        },
      };

      const loaderArgs = {
        context: contextWithNoOrder,
        request: new Request('http://localhost/wholesale/orders/invalid'),
        params: {orderId: 'invalid'},
      };

      await expect(loader(loaderArgs as any)).rejects.toThrow();
    });
  });

  describe('AC6: Order details display', () => {
    it('renders order header with number, date, and status', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders/:orderId',
          Component: OrderDetailsPage,
          loader: () => Promise.resolve({order: mockOrderData.data.order}),
        },
      ]);

      render(<RemixStub initialEntries={[`/wholesale/orders/${TEST_ORDER_ID}`]} />);

      await waitFor(() => {
        expect(screen.getByText(/Order #1001/i)).toBeInTheDocument();
        expect(screen.getByText(/January 15, 2026/i)).toBeInTheDocument();
        expect(screen.getByText(/FULFILLED/i)).toBeInTheDocument();
      });
    });

    it('renders all line items with quantities', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders/:orderId',
          Component: OrderDetailsPage,
          loader: () => Promise.resolve({order: mockOrderData.data.order}),
        },
      ]);

      render(<RemixStub initialEntries={[`/wholesale/orders/${TEST_ORDER_ID}`]} />);

      await waitFor(() => {
        // Line item 1
        expect(screen.getByText(/Lavender Soap/i)).toBeInTheDocument();
        expect(screen.getByText(/Qty: 2/i)).toBeInTheDocument();

        // Line item 2
        expect(screen.getByText(/Eucalyptus Soap/i)).toBeInTheDocument();
        expect(screen.getByText(/Qty: 1/i)).toBeInTheDocument();
      });
    });

    it('renders order summary with subtotal, shipping, tax, and total', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders/:orderId',
          Component: OrderDetailsPage,
          loader: () => Promise.resolve({order: mockOrderData.data.order}),
        },
      ]);

      render(<RemixStub initialEntries={[`/wholesale/orders/${TEST_ORDER_ID}`]} />);

      // Check for order summary heading
      await waitFor(() => {
        expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
      });

      // All summary elements should be present
      expect(screen.getByText(/^Subtotal$/i)).toBeInTheDocument();
      expect(screen.getByText(/\$130\.00/)).toBeInTheDocument();
      expect(screen.getByText(/^Tax$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Total$/i)).toBeInTheDocument();
      expect(screen.getByText(/\$150\.00/)).toBeInTheDocument();

      // Use getAllByText for "Shipping" since it appears in both summary and address
      const shippingElements = screen.getAllByText(/Shipping/i);
      expect(shippingElements.length).toBeGreaterThan(0);
    });

    it('renders shipping address', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders/:orderId',
          Component: OrderDetailsPage,
          loader: () => Promise.resolve({order: mockOrderData.data.order}),
        },
      ]);

      render(<RemixStub initialEntries={[`/wholesale/orders/${TEST_ORDER_ID}`]} />);

      await waitFor(() => {
        expect(screen.getByText(/Shipping Address/i)).toBeInTheDocument();
        expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
        expect(screen.getByText(/Anytown, CA 12345/i)).toBeInTheDocument();
        expect(screen.getByText(/United States/i)).toBeInTheDocument();
      });
    });
  });
});
