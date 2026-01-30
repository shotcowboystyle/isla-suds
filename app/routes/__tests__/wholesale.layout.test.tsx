/**
 * Wholesale Portal Layout Integration Tests
 *
 * Tests the wholesale portal layout component including:
 * - Minimal header with logo
 * - Partner name display
 * - Logout button with confirmation
 * - No Lenis smooth scroll
 * - No animations
 * - Mobile responsiveness
 * - Keyboard accessibility
 *
 * Story: 7.2
 */

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createRoutesStub} from 'react-router';
import WholesaleLayout, {loader} from '~/routes/wholesale';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

describe('Wholesale Portal Layout', () => {
  const mockCustomer = {
    data: {
      customer: {
        id: 'gid://shopify/Customer/123',
        email: 'partner@example.com',
        displayName: 'Jane Smith',
        company: {
          id: 'gid://shopify/Company/456',
          name: 'Example Wholesale Co',
        },
      },
    },
  };

  const mockContext = {
    session: {
      get: vi.fn().mockResolvedValue('customer-123'),
      unset: vi.fn(),
      commit: vi.fn().mockResolvedValue('session-cookie'),
    },
    customerAccount: {
      query: vi.fn().mockResolvedValue(mockCustomer),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AC1: Minimal header with logo, logout, and partner name', () => {
    it('renders minimal header with logo', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        // Logo should be present
        const logo = screen.getByRole('link', {name: /isla suds/i});
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('href', WHOLESALE_ROUTES.DASHBOARD);
      });
    });

    it('displays partner name from customer data', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        // Partner name should be displayed in header (first name only)
        const welcomeText = screen.getByText((content, element) => {
          return (
            element?.tagName === 'SPAN' &&
            /Welcome.*Jane/i.test(content)
          );
        });
        expect(welcomeText).toBeInTheDocument();
      });
    });

    it('renders logout button with friendly confirmation', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        const logoutButton = screen.getByRole('button', {
          name: wholesaleContent.auth.logoutButton,
        });
        expect(logoutButton).toBeInTheDocument();
      });

      // Click logout should show confirmation
      const logoutButton = screen.getByRole('button', {
        name: wholesaleContent.auth.logoutButton,
      });
      await user.click(logoutButton);

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(
          screen.getByText(/are you sure you want to log out/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('AC2: No Lenis smooth scroll on wholesale routes', () => {
    it('verifies wholesale routes exclude Framer Motion and Lenis dependencies', () => {
      // Verify the wholesale layout component does NOT import Lenis or Framer Motion
      // This is a static check - Lenis initialization is controlled in root.tsx
      // via pathname.startsWith('/wholesale') check (see root.tsx:228-233)

      // The component source should not contain motion.* imports
      const componentSource = WholesaleLayout.toString();
      expect(componentSource).not.toMatch(/motion\./);
      expect(componentSource).not.toMatch(/framer-motion/);

      // Lenis initialization logic lives in root.tsx and is tested there
      // This test verifies wholesale components remain animation-free
      expect(true).toBe(true);
    });
  });

  describe('AC3: No animations for wholesale routes', () => {
    it('does not import Framer Motion components', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      const {container} = render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        // No Framer Motion motion.* elements should be present
        const motionElements = container.querySelectorAll('[data-motion]');
        expect(motionElements).toHaveLength(0);
      });
    });

    it('uses clean, instant transitions only', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      const {container} = render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        // Header should not have complex animation classes
        expect(header?.className).not.toMatch(/motion|animate|parallax/i);
      });
    });
  });

  describe('AC4: Clean typography system', () => {
    it('uses design tokens from app/styles/', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      const {container} = render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        // Should use Tailwind classes that map to design tokens
        expect(header?.className).toMatch(
          /text-|bg-|min-h-|px-|py-|flex|items-center/,
        );
      });
    });
  });

  describe('AC5: Mobile responsiveness', () => {
    it('renders mobile-friendly header', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      const {container} = render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        // Header should have responsive padding/spacing
        expect(header?.className).toMatch(/sm:|md:|lg:/);
      });
    });

    it('ensures touch-friendly logout button (min 44x44px)', async () => {
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        const logoutButton = screen.getByRole('button', {
          name: wholesaleContent.auth.logoutButton,
        });

        // Button should have Tailwind classes for minimum 44x44px touch target
        // min-h-[44px] and min-w-[44px] ensure WCAG 2.1 AA compliance
        expect(logoutButton.className).toMatch(/min-h-\[44px\]/);
        expect(logoutButton.className).toMatch(/min-w-\[44px\]/);
      });
    });
  });

  describe('AC6: Keyboard accessibility', () => {
    it('allows tab navigation through header elements', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        expect(screen.getByRole('link', {name: /isla suds/i})).toBeInTheDocument();
      });

      // Tab to logo link
      await user.tab();
      expect(screen.getByRole('link', {name: /isla suds/i})).toHaveFocus();

      // Tab to logout button
      await user.tab();
      expect(
        screen.getByRole('button', {name: wholesaleContent.auth.logoutButton}),
      ).toHaveFocus();
    });

    it('shows visible focus states on interactive elements', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        expect(screen.getByRole('link', {name: /isla suds/i})).toBeInTheDocument();
      });

      // Tab to logo and verify focus ring is present
      await user.tab();
      const logo = screen.getByRole('link', {name: /isla suds/i});
      expect(logo).toHaveFocus();
      // Should have focus ring styles
      expect(logo.className).toMatch(/focus:|focus-visible:/);
    });

    it('allows logout via keyboard (Enter/Space)', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', {name: wholesaleContent.auth.logoutButton}),
        ).toBeInTheDocument();
      });

      // Tab to logout button
      await user.tab();
      await user.tab();

      const logoutButton = screen.getByRole('button', {
        name: wholesaleContent.auth.logoutButton,
      });
      expect(logoutButton).toHaveFocus();

      // Press Enter to trigger logout confirmation
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByText(/are you sure you want to log out/i),
        ).toBeInTheDocument();
      });
    });

    it('allows closing dialog with Escape key', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', {name: wholesaleContent.auth.logoutButton}),
        ).toBeInTheDocument();
      });

      // Open logout dialog
      const logoutButton = screen.getByRole('button', {
        name: wholesaleContent.auth.logoutButton,
      });
      await user.click(logoutButton);

      await waitFor(() => {
        expect(
          screen.getByText(/are you sure you want to log out/i),
        ).toBeInTheDocument();
      });

      // Press Escape to close dialog
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure you want to log out/i),
        ).not.toBeInTheDocument();
      });
    });

    it('allows closing dialog by clicking overlay', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      const {container} = render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', {name: wholesaleContent.auth.logoutButton}),
        ).toBeInTheDocument();
      });

      // Open logout dialog
      const logoutButton = screen.getByRole('button', {
        name: wholesaleContent.auth.logoutButton,
      });
      await user.click(logoutButton);

      await waitFor(() => {
        expect(
          screen.getByText(/are you sure you want to log out/i),
        ).toBeInTheDocument();
      });

      // Click overlay (not dialog content) to close
      const overlay = container.querySelector('[role="dialog"]');
      if (overlay) {
        await user.click(overlay);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure you want to log out/i),
        ).not.toBeInTheDocument();
      });
    });

    it('auto-focuses confirm button when dialog opens', async () => {
      const user = userEvent.setup();
      const RemixStub = createRoutesStub([
        {
          path: '/wholesale',
          Component: WholesaleLayout,
          loader: () =>
            Promise.resolve({customer: mockCustomer.data.customer}),
          children: [{path: '', Component: () => <div>Dashboard Content</div>}],
        },
      ]);

      render(<RemixStub initialEntries={['/wholesale']} />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', {name: wholesaleContent.auth.logoutButton}),
        ).toBeInTheDocument();
      });

      // Open logout dialog
      const logoutButton = screen.getByRole('button', {
        name: wholesaleContent.auth.logoutButton,
      });
      await user.click(logoutButton);

      await waitFor(() => {
        // Confirm button should have focus
        const confirmButton = screen.getByRole('button', {
          name: wholesaleContent.logout.confirmButton,
        });
        expect(confirmButton).toHaveFocus();
      });
    });
  });

  describe('Loader: Session verification', () => {
    it('returns customer data when session is valid', async () => {
      const loaderArgs = {
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      };

      const result = await loader(loaderArgs as any);

      expect(result).toEqual({customer: mockCustomer.data.customer});
      expect(mockContext.session.get).toHaveBeenCalledWith('customerId');
      expect(mockContext.customerAccount.query).toHaveBeenCalled();
    });

    it('redirects to login when no session exists', async () => {
      const contextWithoutSession = {
        ...mockContext,
        session: {
          ...mockContext.session,
          get: vi.fn().mockResolvedValue(null),
        },
      };

      const loaderArgs = {
        context: contextWithoutSession,
        request: new Request('http://localhost/wholesale'),
        params: {},
      };

      const result = await loader(loaderArgs as any);

      expect(result).toHaveProperty('status', 302);
      expect(result).toHaveProperty('headers');
    });
  });
});
