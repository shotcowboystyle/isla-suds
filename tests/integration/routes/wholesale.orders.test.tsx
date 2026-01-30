/**
 * Wholesale Order History Integration Tests
 *
 * Tests the order history route including:
 * - Paginated order list display
 * - Authentication verification
 * - Order date, number, total, status display
 * - View Details navigation
 * - Load more pagination
 *
 * Story: 7.7
 */

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createRoutesStub} from 'react-router';
import OrderHistoryPage, {loader} from '~/routes/wholesale.orders';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

describe('Order History Route', () => {
  const mockOrdersData = {
    data: {
      customer: {
        orders: {
          edges: [
            {
              cursor: 'cursor-1',
              node: {
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
              },
            },
            {
              cursor: 'cursor-2',
              node: {
                id: 'gid://shopify/Order/2',
                name: '#1002',
                orderNumber: '1002',
                processedAt: '2026-01-10T14:20:00Z',
                financialStatus: 'PAID',
                fulfillmentStatus: 'IN_TRANSIT',
                currentTotalPrice: {
                  amount: '225.50',
                  currencyCode: 'USD',
                },
              },
            },
          ],
          pageInfo: {
            hasNextPage: true,
            endCursor: 'cursor-2',
          },
        },
      },
    },
  };

  const mockContext = {
    session: {
      get: vi.fn().mockResolvedValue('customer-123'),
    },
    customerAccount: {
      query: vi.fn().mockResolvedValue(mockOrdersData),
    },
    storefront: {
      CacheShort: vi.fn(() => ({maxAge: 300})),
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
        request: new Request('http://localhost/wholesale/orders'),
        params: {},
      };

      const result = await loader(loaderArgs as any);

      expect(result).toHaveProperty('status', 302);
      expect(result.headers?.get('Location')).toBe(WHOLESALE_ROUTES.LOGIN);
    });

    it('fetches paginated orders with bounded query (first: 10)', async () => {
      const loaderArgs = {
        context: mockContext,
        request: new Request('http://localhost/wholesale/orders'),
        params: {},
      };

      await loader(loaderArgs as any);

      expect(mockContext.customerAccount.query).toHaveBeenCalledWith(
        expect.stringContaining('first: $first'),
        expect.objectContaining({
          variables: expect.objectContaining({
            first: 10, // Bounded query requirement
          }),
        }),
      );
    });

    it('supports pagination via after cursor from URL', async () => {
      const loaderArgs = {
        context: mockContext,
        request: new Request(
          'http://localhost/wholesale/orders?after=cursor-2',
        ),
        params: {},
      };

      await loader(loaderArgs as any);

      expect(mockContext.customerAccount.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          variables: expect.objectContaining({
            after: 'cursor-2',
          }),
        }),
      );
    });

    it('returns orders and page info', async () => {
      const loaderArgs = {
        context: mockContext,
        request: new Request('http://localhost/wholesale/orders'),
        params: {},
      };

      const result = await loader(loaderArgs as any);

      expect(result).toEqual({
        orders: mockOrdersData.data.customer.orders.edges.map(
          (edge) => edge.node,
        ),
        pageInfo: mockOrdersData.data.customer.orders.pageInfo,
      });
    });
  });

  describe('AC1-3: Order list display', () => {
    it('renders order list with date, number, total, status', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () =>
            Promise.resolve({
              orders: mockOrdersData.data.customer.orders.edges.map(
                (edge) => edge.node,
              ),
              pageInfo: mockOrdersData.data.customer.orders.pageInfo,
            }),
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale/orders']} />);

      await waitFor(() => {
        // Order #1001 should be visible
        expect(screen.getByText(/Order #1001/i)).toBeInTheDocument();
        expect(screen.getByText(/\$150\.00/)).toBeInTheDocument();
        expect(screen.getByText(/FULFILLED/i)).toBeInTheDocument();

        // Order #1002 should be visible
        expect(screen.getByText(/Order #1002/i)).toBeInTheDocument();
        expect(screen.getByText(/\$225\.50/)).toBeInTheDocument();
        expect(screen.getByText(/IN_TRANSIT/i)).toBeInTheDocument();
      });
    });

    it('displays orders sorted newest first (via API query)', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () =>
            Promise.resolve({
              orders: mockOrdersData.data.customer.orders.edges.map(
                (edge) => edge.node,
              ),
              pageInfo: mockOrdersData.data.customer.orders.pageInfo,
            }),
        },
      ]);

      const {container} = render(
        <RemixStub initialEntries={['/wholesale/orders']} />,
      );

      await waitFor(() => {
        const orders = container.querySelectorAll('[data-testid="order-item"]');
        expect(orders.length).toBeGreaterThan(0);

        // First order should be #1001 (newer date: Jan 15)
        expect(orders[0]).toHaveTextContent('#1001');
        // Second order should be #1002 (older date: Jan 10)
        expect(orders[1]).toHaveTextContent('#1002');
      });
    });
  });

  describe('AC4: View Details link', () => {
    it('renders View Details link for each order', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () =>
            Promise.resolve({
              orders: mockOrdersData.data.customer.orders.edges.map(
                (edge) => edge.node,
              ),
              pageInfo: mockOrdersData.data.customer.orders.pageInfo,
            }),
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale/orders']} />);

      await waitFor(() => {
        const viewDetailsLinks = screen.getAllByText(/View Details/i);
        expect(viewDetailsLinks.length).toBe(2); // One for each order

        // Links should navigate to order details page
        expect(viewDetailsLinks[0]).toHaveAttribute(
          'href',
          `/wholesale/orders/${mockOrdersData.data.customer.orders.edges[0].node.id}`,
        );
        expect(viewDetailsLinks[1]).toHaveAttribute(
          'href',
          `/wholesale/orders/${mockOrdersData.data.customer.orders.edges[1].node.id}`,
        );
      });
    });
  });

  describe('AC5: Pagination (Load more)', () => {
    it('shows Load More button when hasNextPage is true', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () =>
            Promise.resolve({
              orders: mockOrdersData.data.customer.orders.edges.map(
                (edge) => edge.node,
              ),
              pageInfo: {
                hasNextPage: true,
                endCursor: 'cursor-2',
              },
            }),
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale/orders']} />);

      await waitFor(() => {
        const loadMoreButton = screen.getByRole('button', {
          name: /Load More Orders/i,
        });
        expect(loadMoreButton).toBeInTheDocument();
      });
    });

    it('hides Load More button when hasNextPage is false', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () =>
            Promise.resolve({
              orders: mockOrdersData.data.customer.orders.edges.map(
                (edge) => edge.node,
              ),
              pageInfo: {
                hasNextPage: false,
                endCursor: 'cursor-2',
              },
            }),
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale/orders']} />);

      await waitFor(() => {
        expect(screen.getByText(/Order #1001/i)).toBeInTheDocument();
      });

      // Load More should NOT be present
      expect(
        screen.queryByRole('button', {name: /Load More Orders/i}),
      ).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('shows friendly message when no orders exist', async () => {
      const emptyContext = {
        ...mockContext,
        customerAccount: {
          query: vi.fn().mockResolvedValue({
            data: {
              customer: {
                orders: {
                  edges: [],
                  pageInfo: {
                    hasNextPage: false,
                    endCursor: null,
                  },
                },
              },
            },
          }),
        },
      };

      const loaderArgs = {
        context: emptyContext,
        request: new Request('http://localhost/wholesale/orders'),
        params: {},
      };

      const result = await loader(loaderArgs as any);

      expect(result.orders).toEqual([]);

      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () => Promise.resolve(result),
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale/orders']} />);

      await waitFor(() => {
        expect(
          screen.getByText(/You haven't placed any orders yet/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('shows empty state when API fails gracefully', async () => {
      const errorContext = {
        ...mockContext,
        customerAccount: {
          query: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      };

      const loaderArgs = {
        context: errorContext,
        request: new Request('http://localhost/wholesale/orders'),
        params: {},
      };

      const result = await loader(loaderArgs as any);

      // Should gracefully degrade to empty state
      expect(result.orders).toEqual([]);
      expect(result.pageInfo.hasNextPage).toBe(false);

      const RemixStub = createRoutesStub([
        {
          path: '/wholesale/orders',
          Component: OrderHistoryPage,
          loader: () => Promise.resolve(result),
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale/orders']} />);

      await waitFor(() => {
        expect(
          screen.getByText(/You haven't placed any orders yet/i),
        ).toBeInTheDocument();
      });
    });
  });
});
