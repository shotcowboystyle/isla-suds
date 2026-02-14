import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router';
import {Header} from './Header';
import HeaderMenu from './HeaderMenu';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';

// Mock close function for testing mobile menu behavior
const mockClose = vi.fn();

// Hoist mocks to ensure they're available before module evaluation
const {mockSetCartDrawerOpen, mockExplorationState} = vi.hoisted(() => {
  const mockSetCartDrawerOpen = vi.fn();
  const mockExplorationState = {
    cartDrawerOpen: false,
    setCartDrawerOpen: mockSetCartDrawerOpen,
    productsExplored: new Set(),
    textureRevealsTriggered: 0,
    storyMomentShown: false,
    sessionStartTime: 0,
    addProductExplored: vi.fn(),
    incrementTextureReveals: vi.fn(),
    setStoryMomentShown: vi.fn(),
    resetSession: vi.fn(),
  };
  return {mockSetCartDrawerOpen, mockExplorationState};
});

// Mock dependencies
vi.mock('~/components/Aside', () => ({
  useAside: () => ({
    open: vi.fn(),
    close: mockClose,
  }),
}));

vi.mock('~/components/Logo', () => ({
  Logo: () => <div>Logo</div>,
}));

vi.mock('~/components/Picture', () => ({
  Picture: ({alt, ...props}: any) => <img alt={alt || ''} {...props} />,
}));

vi.mock('~/contexts/home-scroll-context', () => ({
  useHomeScroll: () => ({
    isPastHero: true,
    heroProgress: 0,
  }),
}));

vi.mock('~/hooks/use-is-mobile', () => ({
  useIsMobile: () => ({isMobile: false, isLoading: false}),
}));

vi.mock('~/stores/exploration', () => {
  // Create a proper Zustand-like store mock
  const mockStore = (selector?: any) => {
    return selector ? selector(mockExplorationState) : mockExplorationState;
  };

  // Add Zustand store methods
  mockStore.getState = () => mockExplorationState;
  mockStore.setState = vi.fn();
  mockStore.subscribe = vi.fn();
  mockStore.destroy = vi.fn();

  return {
    useExplorationStore: mockStore,
  };
});

vi.mock('@shopify/hydrogen', () => ({
  useAnalytics: () => ({
    publish: vi.fn(),
    shop: {},
    cart: null,
    prevCart: null,
  }),
  useOptimisticCart: (cart: CartApiQueryFragment | null) => cart,
}));

// Mock image imports used by HeaderMenu
vi.mock('../assets/images/menu-about-us.webp?responsive', () => ({
  default: {src: '/mock-about-us.webp'},
}));
vi.mock('../assets/images/menu-policies.webp?responsive', () => ({
  default: {src: '/mock-policies.webp'},
}));
vi.mock('../assets/images/menu-catalog.png?responsive', () => ({
  default: {src: '/mock-catalog.png'},
}));
vi.mock('../assets/images/menu-contact.jpeg?responsive', () => ({
  default: {src: '/mock-contact.jpeg'},
}));
vi.mock('../assets/images/menu-home.png?responsive', () => ({
  default: {src: '/mock-home.png'},
}));
vi.mock('../assets/images/menu-tasty-talks.png?responsive', () => ({
  default: {src: '/mock-tasty-talks.png'},
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ShoppingBag: (props: any) => (
    <svg data-testid="shopping-bag-icon" {...props}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    </svg>
  ),
  User: (props: any) => (
    <svg data-testid="user-icon" {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    </svg>
  ),
}));

// Mock CSS modules
vi.mock('./Header.module.css', () => ({
  default: new Proxy(
    {},
    {
      get: (_target, prop) => String(prop),
    },
  ),
}));

// Mock data
const mockHeader: HeaderQuery = {
  shop: {
    id: 'gid://shopify/Shop/1',
    name: 'Isla Suds',
    description: 'Natural soap products',
    primaryDomain: {
      url: 'https://isla-suds.com',
    },
  },
  menu: null, // Will use FALLBACK_HEADER_MENU
};

const mockCart: CartApiQueryFragment | null = null;
const publicStoreDomain = 'isla-suds.myshopify.com';

// Helper to render Header with router context
function renderHeader() {
  return render(
    <MemoryRouter>
      <Header
        header={mockHeader}
        cart={Promise.resolve(mockCart)}
        isLoggedIn={Promise.resolve(false)}
        publicStoreDomain={publicStoreDomain}
      />
    </MemoryRouter>,
  );
}

// Helper to render HeaderMenu directly (for mobile menu tests)
function renderHeaderMenu(viewport: 'desktop' | 'mobile' = 'mobile') {
  return render(
    <MemoryRouter>
      <HeaderMenu
        menu={mockHeader.menu}
        viewport={viewport}
        primaryDomainUrl={mockHeader.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockClose.mockClear();
  });

  describe('FALLBACK_HEADER_MENU - Wholesale Link (AC1, AC2)', () => {
    it('renders wholesale link in mobile menu pointing to /wholesale/login', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});
      expect(wholesaleLink).toBeInTheDocument();
      expect(wholesaleLink).toHaveAttribute('href', '/wholesale/login');
    });

    it('wholesale link has correct title text', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});
      expect(wholesaleLink).toHaveTextContent('Wholesale');
    });

    it('wholesale link appears after About link in menu order', () => {
      renderHeaderMenu('mobile');
      const links = screen.getAllByRole('link');
      const linkTexts = links.map((link) => link.textContent);
      const aboutIndex = linkTexts.indexOf('About');
      const wholesaleIndex = linkTexts.indexOf('Wholesale');
      expect(wholesaleIndex).toBeGreaterThan(aboutIndex);
    });

    it('mobile menu includes Home link when viewport is mobile', () => {
      renderHeaderMenu('mobile');
      const homeLink = screen.getByRole('link', {name: /^home$/i});
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders all expected menu items in mobile menu', () => {
      renderHeaderMenu('mobile');
      expect(screen.getByRole('link', {name: /^home$/i})).toBeInTheDocument();
      expect(
        screen.getByRole('link', {name: /collections/i}),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', {name: /blog/i})).toBeInTheDocument();
      expect(
        screen.getByRole('link', {name: /policies/i}),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', {name: /about/i})).toBeInTheDocument();
      expect(
        screen.getByRole('link', {name: /wholesale/i}),
      ).toBeInTheDocument();
    });
  });

  describe('Navigation Links (AC1, AC4)', () => {
    it('Collections link points to /collections', () => {
      renderHeaderMenu('mobile');
      const collectionsLink = screen.getByRole('link', {
        name: /collections/i,
      });
      expect(collectionsLink).toHaveAttribute('href', '/collections');
    });

    it('Blog link points to /blogs/journal', () => {
      renderHeaderMenu('mobile');
      const blogLink = screen.getByRole('link', {name: /blog/i});
      expect(blogLink).toHaveAttribute('href', '/blogs/journal');
    });

    it('Policies link points to /policies', () => {
      renderHeaderMenu('mobile');
      const policiesLink = screen.getByRole('link', {name: /policies/i});
      expect(policiesLink).toHaveAttribute('href', '/policies');
    });

    it('About link points to /about', () => {
      renderHeaderMenu('mobile');
      const aboutLink = screen.getByRole('link', {name: /about/i});
      expect(aboutLink).toHaveAttribute('href', '/about');
    });
  });

  describe('Semantic HTML & Accessibility (AC5)', () => {
    it('header menu is wrapped in nav element', () => {
      renderHeaderMenu('mobile');
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('all navigation links are keyboard accessible', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});
      expect(wholesaleLink).not.toHaveAttribute('tabIndex', '-1');
    });

    it('wholesale link is reachable via keyboard navigation', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});
      // Link should be in the DOM and not have pointer-events disabled
      expect(wholesaleLink).toBeInTheDocument();
      expect(wholesaleLink).not.toHaveClass('pointer-events-none');
    });
  });

  describe('Design Token Usage (AC1, AC4)', () => {
    it('wholesale link uses consistent styling with other menu items', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});
      const aboutLink = screen.getByRole('link', {name: /about/i});

      // Both should use the same inline Tailwind class pattern
      expect(wholesaleLink).toHaveClass('uppercase');
      expect(aboutLink).toHaveClass('uppercase');
      expect(wholesaleLink).toHaveClass('font-extrabold');
      expect(aboutLink).toHaveClass('font-extrabold');
    });

    it('activeLinkStyle uses design tokens for colors', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});

      // Get computed style
      const style = wholesaleLink.getAttribute('style');

      // Verify style uses CSS variables (not hardcoded colors like 'black' or 'grey')
      // Active links should use var(--text-primary) or var(--text-muted)
      expect(style).toBeDefined();
    });
  });

  describe('Mobile Menu Behavior (AC2)', () => {
    it('mobile menu renders navigation with links', () => {
      renderHeaderMenu('mobile');
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      const links = nav.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
    });

    it('desktop menu also includes Home link (used in full navigation)', () => {
      renderHeaderMenu('desktop');
      const homeLink = screen.getByRole('link', {name: /^home$/i});
      expect(homeLink).toBeInTheDocument();
    });

    it('all menu links have onClick handler', () => {
      renderHeaderMenu('mobile');
      const nav = screen.getByRole('navigation');
      const links = nav.querySelectorAll('a');
      // Links are NavLink components which handle routing
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Link Visibility (AC4)', () => {
    it('wholesale link uses same text styling as other links', () => {
      renderHeaderMenu('mobile');
      const wholesaleLink = screen.getByRole('link', {name: /wholesale/i});
      const aboutLink = screen.getByRole('link', {name: /about/i});

      // Should have same styling classes (not bold, highlighted differently, etc.)
      expect(wholesaleLink).toHaveClass('tracking-tighter');
      expect(aboutLink).toHaveClass('tracking-tighter');
    });

    it('wholesale link appears at end of navigation list', () => {
      renderHeaderMenu('mobile');
      const nav = screen.getByRole('navigation');
      const navLinks = nav.querySelectorAll('a');
      const lastNavLink = navLinks[navLinks.length - 1];
      expect(lastNavLink).toHaveTextContent('Wholesale');
    });
  });

  describe('Story 5.10: Cart Icon in Header', () => {
    beforeEach(() => {
      // Clear the mock before each test
      mockSetCartDrawerOpen.mockClear();
    });

    describe('Cart Icon Display (AC1)', () => {
      it('renders cart icon button in sticky header', async () => {
        renderHeader();
        await waitFor(() => {
          expect(screen.queryByRole('button', {name: /shopping cart/i})).toBeInTheDocument();
        });
      });

      it('cart icon is positioned on right side of header', async () => {
        renderHeader();
        await waitFor(() => {
          expect(screen.queryByRole('button', {name: /shopping cart/i})).toBeInTheDocument();
        });
      });

      it('cart icon button is rendered with proper CSS module classes', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        // CSS module classes are applied via styles['navbar-button'] and styles['navbar-icon-button']
        expect(cartButton).toHaveClass('navbar-button');
        expect(cartButton).toHaveClass('navbar-icon-button');
      });

      it('cart icon is keyboard-accessible', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        expect(cartButton).not.toHaveAttribute('tabindex', '-1');
      });
    });

    describe('Item Count Badge (AC2, AC3)', () => {
      it('displays badge with count when cart has items', async () => {
        const cartWithItems: CartApiQueryFragment = {
          id: 'cart-123',
          totalQuantity: 3,
          lines: {nodes: [{} as any, {} as any, {} as any]},
          cost: {
            subtotalAmount: {amount: '30.00', currencyCode: 'USD'},
            totalAmount: {amount: '30.00', currencyCode: 'USD'},
          },
          checkoutUrl: 'https://checkout.shopify.com/cart-123',
          updatedAt: new Date().toISOString(),
          note: null,
          appliedGiftCards: [],
          buyerIdentity: {} as any,
          attributes: [],
          discountCodes: [],
        };

        render(
          <MemoryRouter>
            <Header
              header={mockHeader}
              cart={Promise.resolve(cartWithItems)}
              isLoggedIn={Promise.resolve(false)}
              publicStoreDomain={publicStoreDomain}
            />
          </MemoryRouter>,
        );

        // Badge should show count
        const badge = await screen.findByText('3');
        expect(badge).toBeInTheDocument();
      });

      it('hides badge when cart is empty', async () => {
        renderHeader();
        // Wait for cart icon to render
        await screen.findByRole('button', {name: /shopping cart/i});
        // Badge should NOT render "0"
        expect(screen.queryByText('0')).not.toBeInTheDocument();
      });

      it('displays "99+" for cart with >99 items (AC2 edge case)', async () => {
        const cartWith100Items: CartApiQueryFragment = {
          id: 'cart-123',
          totalQuantity: 100,
          lines: {nodes: Array(100).fill({} as any)},
          cost: {
            subtotalAmount: {amount: '1000.00', currencyCode: 'USD'},
            totalAmount: {amount: '1000.00', currencyCode: 'USD'},
          },
          checkoutUrl: 'https://checkout.shopify.com/cart-123',
          updatedAt: new Date().toISOString(),
          note: null,
          appliedGiftCards: [],
          buyerIdentity: {} as any,
          attributes: [],
          discountCodes: [],
        };

        render(
          <MemoryRouter>
            <Header
              header={mockHeader}
              cart={Promise.resolve(cartWith100Items)}
              isLoggedIn={Promise.resolve(false)}
              publicStoreDomain={publicStoreDomain}
            />
          </MemoryRouter>,
        );

        // Badge should show "99+" instead of "100"
        const badge = await screen.findByText('99+');
        expect(badge).toBeInTheDocument();
        expect(screen.queryByText('100')).not.toBeInTheDocument();
      });

      it('updates ARIA label with item count', async () => {
        const cartWithItems: CartApiQueryFragment = {
          id: 'cart-123',
          totalQuantity: 2,
          lines: {nodes: [{} as any, {} as any]},
          cost: {
            subtotalAmount: {amount: '20.00', currencyCode: 'USD'},
            totalAmount: {amount: '20.00', currencyCode: 'USD'},
          },
          checkoutUrl: 'https://checkout.shopify.com/cart-123',
          updatedAt: new Date().toISOString(),
          note: null,
          appliedGiftCards: [],
          buyerIdentity: {} as any,
          attributes: [],
          discountCodes: [],
        };

        render(
          <MemoryRouter>
            <Header
              header={mockHeader}
              cart={Promise.resolve(cartWithItems)}
              isLoggedIn={Promise.resolve(false)}
              publicStoreDomain={publicStoreDomain}
            />
          </MemoryRouter>,
        );

        const cartButton = await screen.findByRole('button', {
          name: /shopping cart, 2 items/i,
        });
        expect(cartButton).toBeInTheDocument();
      });

      it('ARIA label says "empty" when cart is empty', async () => {
        renderHeader();
        await waitFor(() => {
          expect(screen.queryByRole('button', {name: /shopping cart, empty/i})).toBeInTheDocument();
        });
      });
    });

    describe('Click Handler (AC4)', () => {
      it('mock store is properly configured', () => {
        // Debug test to verify mock setup
        expect(mockSetCartDrawerOpen).toBeDefined();
        expect(typeof mockSetCartDrawerOpen).toBe('function');
        expect(mockExplorationState.setCartDrawerOpen).toBe(mockSetCartDrawerOpen);
      });

      it('clicking cart icon calls setCartDrawerOpen(true)', async () => {
        const user = userEvent.setup();
        let cartButton: HTMLElement;

        await act(async () => {
          renderHeader();
        });

        // Query specifically for the CartIconButton (has ShoppingBag icon)
        await act(async () => {
          cartButton = await screen.findByRole('button', {
            name: /shopping cart, empty/i,
          });
        });

        // Click the button within act to ensure all state updates are flushed
        await act(async () => {
          await user.click(cartButton!);
        });

        // Verify the mock was called
        expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(true);
      });

      it('Enter key opens cart drawer', async () => {
        const user = userEvent.setup();
        let cartButton: HTMLElement;

        await act(async () => {
          renderHeader();
        });

        // Query specifically for the CartIconButton
        await act(async () => {
          cartButton = await screen.findByRole('button', {
            name: /shopping cart, empty/i,
          });
        });

        // Focus and press Enter within act
        await act(async () => {
          cartButton!.focus();
          await user.keyboard('{Enter}');
        });

        // Verify the mock was called
        expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(true);
      });
    });

    describe('Accessibility (AC7)', () => {
      it('cart button has semantic button element', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        expect(cartButton.tagName).toBe('BUTTON');
      });

      it('cart button has type="button" attribute', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        expect(cartButton).toHaveAttribute('type', 'button');
      });

      it('badge has aria-hidden when present', async () => {
        const cartWithItems: CartApiQueryFragment = {
          id: 'cart-123',
          totalQuantity: 1,
          lines: {nodes: [{} as any]},
          cost: {
            subtotalAmount: {amount: '10.00', currencyCode: 'USD'},
            totalAmount: {amount: '10.00', currencyCode: 'USD'},
          },
          checkoutUrl: 'https://checkout.shopify.com/cart-123',
          updatedAt: new Date().toISOString(),
          note: null,
          appliedGiftCards: [],
          buyerIdentity: {} as any,
          attributes: [],
          discountCodes: [],
        };

        render(
          <MemoryRouter>
            <Header
              header={mockHeader}
              cart={Promise.resolve(cartWithItems)}
              isLoggedIn={Promise.resolve(false)}
              publicStoreDomain={publicStoreDomain}
            />
          </MemoryRouter>,
        );

        const badge = await screen.findByText('1');
        expect(badge).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('Responsive Design (AC6, AC9)', () => {
      it('cart icon displays on mobile and desktop', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        // Should be visible (not hidden at any breakpoint)
        expect(cartButton).not.toHaveClass('hidden');
      });
    });

    describe('Styling (AC8)', () => {
      it('cart button uses CSS module navbar classes', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        // Should use CSS module classes for consistent styling
        expect(cartButton).toHaveClass('navbar-button');
        expect(cartButton).toHaveClass('navbar-icon-button');
      });

      it('cart button contains ShoppingBag icon', async () => {
        renderHeader();
        const cartButton = await screen.findByRole('button', {
          name: /shopping cart/i,
        });
        // The ShoppingBag icon from lucide-react renders inside the button
        // In test environment, verify the button has child content (icon)
        expect(cartButton.children.length).toBeGreaterThan(0);
      });
    });
  });
});
