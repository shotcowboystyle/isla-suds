import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {ConstellationGrid} from './ConstellationGrid';
import {useExplorationStore} from '~/stores/exploration';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

// Mock Hydrogen Image component
vi.mock('@shopify/hydrogen', () => ({
  Image: ({
    alt,
    'data-testid': testId,
  }: {
    alt: string;
    'data-testid'?: string;
  }) => <img alt={alt} data-testid={testId} />,
}));

// Mock useVariantUrl hook
vi.mock('~/lib/variant-url', () => ({
  useVariantUrl: (handle: string) => `/products/${handle}`,
}));

// Mock React Router
vi.mock('react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: '/products/test',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

const mockProducts: RecommendedProductFragment[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Lavender Bliss',
    handle: 'lavender-bliss',
    description: 'Soothing lavender soap',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/1',
      url: 'https://cdn.shopify.com/lavender.jpg',
      altText: 'Lavender soap',
      width: 800,
      height: 800,
    },
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Citrus Sunrise',
    handle: 'citrus-sunrise',
    description: 'Energizing citrus soap',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/2',
      url: 'https://cdn.shopify.com/citrus.jpg',
      altText: 'Citrus soap',
      width: 800,
      height: 800,
    },
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Mint Meadow',
    handle: 'mint-meadow',
    description: 'Refreshing mint soap',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/3',
      url: 'https://cdn.shopify.com/mint.jpg',
      altText: 'Mint soap',
      width: 800,
      height: 800,
    },
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'Rose Garden',
    handle: 'rose-garden',
    description: 'Romantic rose soap',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/4',
      url: 'https://cdn.shopify.com/rose.jpg',
      altText: 'Rose soap',
      width: 800,
      height: 800,
    },
  },
];

describe('ConstellationGrid', () => {
  it('renders all 4 product cards', () => {
    render(<ConstellationGrid products={mockProducts} />);

    expect(screen.getByText('Lavender Bliss')).toBeInTheDocument();
    expect(screen.getByText('Citrus Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Mint Meadow')).toBeInTheDocument();
    expect(screen.getByText('Rose Garden')).toBeInTheDocument();
  });

  it('applies snap-start class when className includes it', () => {
    const {container} = render(
      <ConstellationGrid products={mockProducts} className="snap-start" />,
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('snap-start');
  });

  it('renders as a section element with constellation role', () => {
    const {container} = render(<ConstellationGrid products={mockProducts} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.getAttribute('aria-label')).toBe(
      'Product constellation grid',
    );
  });

  it('all product cards are keyboard focusable', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
      // Links are naturally focusable, no explicit tabIndex needed
    });
  });

  it('product cards have meaningful accessible names', () => {
    render(<ConstellationGrid products={mockProducts} />);

    // Each card link should have accessible text content
    expect(screen.getByRole('link', {name: /lavender bliss/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /citrus sunrise/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /mint meadow/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /rose garden/i})).toBeInTheDocument();
  });

  it('renders null when no products provided', () => {
    const {container} = render(<ConstellationGrid products={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when empty products array provided', () => {
    const {container} = render(<ConstellationGrid products={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('ConstellationGrid - Focus State (Story 2.4)', () => {
  beforeEach(() => {
    // Reset exploration store before each test
    useExplorationStore.setState({
      productsExplored: new Set(),
      textureRevealsTriggered: 0,
      storyMomentShown: false,
      sessionStartTime: 0,
      cartDrawerOpen: false,
    });
  });

  it('applies focused state when hovering on desktop', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});

    // Simulate hover (mouseenter)
    fireEvent.mouseEnter(firstCard);

    // Card should have focused state (scale, shadow)
    expect(firstCard).toHaveClass('scale-[1.02]');
    expect(firstCard).toHaveClass('shadow-lg');
  });

  it('applies dimmed state to other products when one is focused', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});
    const secondCard = screen.getByRole('link', {name: /citrus sunrise/i});

    fireEvent.mouseEnter(firstCard);

    // First card should be focused (no opacity change)
    expect(firstCard).not.toHaveClass('opacity-60');

    // Other cards should be dimmed
    expect(secondCard).toHaveClass('opacity-60');
  });

  it('moves focus to new product when hovering another', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});
    const secondCard = screen.getByRole('link', {name: /citrus sunrise/i});

    // Hover first card
    fireEvent.mouseEnter(firstCard);
    expect(firstCard).toHaveClass('scale-[1.02]');
    expect(secondCard).toHaveClass('opacity-60');

    // Hover second card
    fireEvent.mouseEnter(secondCard);
    expect(secondCard).toHaveClass('scale-[1.02]');
    expect(firstCard).toHaveClass('opacity-60');
  });

  it('clears focus when clicking on section background (not on a card)', () => {
    const {container} = render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});
    const section = container.querySelector('section');

    // Focus first card
    fireEvent.mouseEnter(firstCard);
    expect(firstCard).toHaveClass('scale-[1.02]');

    // Click on section background (inside section, not on a card)
    fireEvent.click(section!);

    // Focus should be cleared
    expect(firstCard).not.toHaveClass('scale-[1.02]');
    expect(firstCard).not.toHaveClass('opacity-60');
  });

  it('clears focus when clicking outside section (e.g. elsewhere on page)', () => {
    render(
      <div>
        <div data-testid="page-elsewhere">Other content</div>
        <ConstellationGrid products={mockProducts} />
      </div>,
    );

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});
    const elsewhere = screen.getByTestId('page-elsewhere');

    // Focus first card
    fireEvent.mouseEnter(firstCard);
    expect(firstCard).toHaveClass('scale-[1.02]');

    // Click outside the constellation section (AC3)
    fireEvent.click(elsewhere);

    // Focus should be cleared
    expect(firstCard).not.toHaveClass('scale-[1.02]');
    expect(firstCard).not.toHaveClass('opacity-60');
  });

  it('activates focus state with keyboard Enter key', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});

    // Focus with Tab (simulated by focus event)
    fireEvent.focus(firstCard);

    // Activate with Enter
    fireEvent.keyDown(firstCard, {key: 'Enter', code: 'Enter'});

    expect(firstCard).toHaveClass('scale-[1.02]');
  });

  it('activates focus state with keyboard Space key', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});

    fireEvent.focus(firstCard);
    fireEvent.keyDown(firstCard, {key: ' ', code: 'Space'});

    expect(firstCard).toHaveClass('scale-[1.02]');
  });

  it('clears focus when Escape key is pressed', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});

    // Focus card
    fireEvent.mouseEnter(firstCard);
    expect(firstCard).toHaveClass('scale-[1.02]');

    // Press Escape
    fireEvent.keyDown(firstCard, {key: 'Escape', code: 'Escape'});

    // Focus should be cleared
    expect(firstCard).not.toHaveClass('scale-[1.02]');
  });

  it('calls addProductExplored when product enters focused state', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});

    // Focus card via hover
    fireEvent.mouseEnter(firstCard);

    // Check store was updated
    const {productsExplored} = useExplorationStore.getState();
    expect(productsExplored.has('gid://shopify/Product/1')).toBe(true);
  });

  it('does not remove from productsExplored when focus is cleared', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});

    // Focus card
    fireEvent.mouseEnter(firstCard);

    // Verify it was added
    let {productsExplored} = useExplorationStore.getState();
    expect(productsExplored.has('gid://shopify/Product/1')).toBe(true);

    // Clear focus
    fireEvent.mouseLeave(firstCard);

    // Verify it's still in the explored set
    productsExplored = useExplorationStore.getState().productsExplored;
    expect(productsExplored.has('gid://shopify/Product/1')).toBe(true);
  });

  it('tracks multiple explored products cumulatively', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const firstCard = screen.getByRole('link', {name: /lavender bliss/i});
    const secondCard = screen.getByRole('link', {name: /citrus sunrise/i});

    // Focus first card
    fireEvent.mouseEnter(firstCard);

    // Focus second card
    fireEvent.mouseEnter(secondCard);

    // Both should be in explored set
    const {productsExplored} = useExplorationStore.getState();
    expect(productsExplored.has('gid://shopify/Product/1')).toBe(true);
    expect(productsExplored.has('gid://shopify/Product/2')).toBe(true);
  });

  it('ensures only one product is focused at a time', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const cards = [
      screen.getByRole('link', {name: /lavender bliss/i}),
      screen.getByRole('link', {name: /citrus sunrise/i}),
      screen.getByRole('link', {name: /mint meadow/i}),
    ];

    // Focus first card
    fireEvent.mouseEnter(cards[0]);
    expect(cards[0]).toHaveClass('scale-[1.02]');
    expect(cards[1]).not.toHaveClass('scale-[1.02]');
    expect(cards[2]).not.toHaveClass('scale-[1.02]');

    // Focus second card
    fireEvent.mouseEnter(cards[1]);
    expect(cards[0]).not.toHaveClass('scale-[1.02]');
    expect(cards[1]).toHaveClass('scale-[1.02]');
    expect(cards[2]).not.toHaveClass('scale-[1.02]');
  });

  it('renders BundleCard for variety pack bundle (Story 3.6)', () => {
    // Add bundle product to products array
    const productsWithBundle: RecommendedProductFragment[] = [
      ...mockProducts.slice(0, 3),
      {
        id: 'gid://shopify/Product/5',
        title: 'The Collection',
        handle: 'four-bar-variety-pack',
        description: 'All four soaps together',
        priceRange: {
          minVariantPrice: {
            amount: '48.00',
            currencyCode: 'USD',
          },
        },
        featuredImage: {
          id: 'gid://shopify/ProductImage/5',
          url: 'https://cdn.shopify.com/bundle.jpg',
          altText: 'Four bar variety pack',
          width: 1200,
          height: 1200,
        },
        scentNarrative: {
          value: 'Four distinct journeys.',
        },
        bundleValueProposition: {
          value: 'All four soaps, one price.',
        },
      },
    ];

    const {container} = render(
      <ConstellationGrid products={productsWithBundle} />,
    );

    // Verify bundle product renders with "The Collection" title
    expect(screen.getByText('The Collection')).toBeInTheDocument();

    // Verify bundle card has data-bundle attribute
    const bundleCard = container.querySelector('[data-bundle="true"]');
    expect(bundleCard).toBeInTheDocument();

    // Verify non-bundle products don't have bundle attribute
    const allLinks = container.querySelectorAll('a');
    const nonBundleLinks = Array.from(allLinks).filter(
      (link) => link.getAttribute('data-bundle') !== 'true',
    );
    expect(nonBundleLinks).toHaveLength(3);
  });
});
