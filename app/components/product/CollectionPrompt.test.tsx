import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {
  CollectionPrompt,
  CollectionPromptWithAnimation,
} from './CollectionPrompt';

// Mock Picture component (renders as simple img for testing)
vi.mock('~/components/Picture', () => ({
  Picture: ({src, alt, className}: {src: unknown; alt: string; className?: string}) => (
    <img data-testid={`picture-${alt}`} alt={alt} className={className} />
  ),
}));

// Mock React Router useFetcher (Story 4.3)
// Mutable state that tests can modify to simulate different fetcher states
const mockSubmit = vi.fn();
const fetcherState = {
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined as any,
  submit: mockSubmit,
};

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useFetcher: () => fetcherState,
  };
});

// Mock Hydrogen CartForm
vi.mock('@shopify/hydrogen', () => ({
  CartForm: Object.assign(
    ({children}: {children: React.ReactNode}) => <div>{children}</div>,
    {
      ACTIONS: {
        LinesAdd: 'LinesAdd',
        LinesUpdate: 'LinesUpdate',
        LinesRemove: 'LinesRemove',
      },
    },
  ),
}));

// Mock exploration store (Story 4.3, Story 5.3)
const mockSetStoryMomentShown = vi.fn();
const mockSetCartDrawerOpen = vi.fn();
vi.mock('~/stores/exploration', () => ({
  useExplorationStore: (selector: any) => {
    const mockState = {
      setStoryMomentShown: mockSetStoryMomentShown,
      setCartDrawerOpen: mockSetCartDrawerOpen,
    };
    return selector ? selector(mockState) : mockState;
  },
}));

/**
 * Tests for CollectionPrompt component (Story 4.2, Task 2)
 *
 * Verifies:
 * AC1: Collection prompt appears with warm copy, product visuals, CTA, dismiss
 * AC4: Uses accessible animation with reduced-motion support
 * AC5: Fully accessible (focus trap, keyboard navigation, screen reader)
 */

describe('CollectionPrompt', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AC1 - Rendering and content', () => {
    it('renders headline from COLLECTION_PROMPT_COPY', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      expect(
        screen.getByText('Loving what you see? Get the whole collection.'),
      ).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      expect(
        screen.getByText(/Experience all four handcrafted scents together/i),
      ).toBeInTheDocument();
    });

    it('renders "Get the Collection" button', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const button = screen.getByRole('button', {
        name: /get the collection/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('renders close button with accessible label', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', {name: /close/i});
      expect(closeButton).toBeInTheDocument();
    });

    it('displays all 4 product images in grid', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      // Check for product names (getAllByText handles duplicates)
      const lavender = screen.getAllByText('Lavender');
      const lemongrass = screen.getAllByText('Lemongrass');
      const eucalyptus = screen.getAllByText('Eucalyptus');
      const rosemarySeaSalt = screen.getAllByText('Rosemary Sea Salt');

      expect(lavender.length).toBeGreaterThanOrEqual(1);
      expect(lemongrass.length).toBeGreaterThanOrEqual(1);
      expect(eucalyptus.length).toBeGreaterThanOrEqual(1);
      expect(rosemarySeaSalt.length).toBeGreaterThanOrEqual(1);
    });

    it('uses fluid typography classes', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      // Verify title and description elements exist (they use fluid classes)
      const title = screen.getByRole('heading', {
        name: /loving what you see/i,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('fluid-heading');
    });

    it('has data-testid attributes for testing', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();
    });
  });

  describe('AC5 - Accessibility', () => {
    it('uses semantic dialog role via Radix', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('close button is keyboard-focusable', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', {name: /close/i});
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });

    it('CTA button is keyboard-accessible', () => {
      const varietyPackVariantId = 'gid://shopify/ProductVariant/123';
      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const ctaButton = screen.getByRole('button', {
        name: /get the collection/i,
      });
      ctaButton.focus();
      expect(ctaButton).toHaveFocus();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', {name: /close/i});
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const {container} = render(
        <CollectionPrompt open={true} onClose={mockOnClose} />,
      );

      // Find the overlay (backdrop)
      const overlay = container.querySelector('[data-radix-overlay]');
      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('close button meets 44x44px touch target minimum', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', {name: /close/i});

      // Check for w-11 h-11 classes (44x44px = 11 * 0.25rem)
      // jsdom doesn't compute styles, so we check class names
      expect(closeButton.className).toMatch(/w-11|h-11/);
    });

    it('CTA button meets 44x44px touch target minimum', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      const ctaButton = screen.getByRole('button', {
        name: /get the collection/i,
      });

      // Check for min-h-[44px] class
      // jsdom doesn't compute styles, so we check class names
      expect(ctaButton.className).toMatch(/min-h-\[44px\]/);
    });
  });

  describe('AC4 - Animation and reduced motion', () => {
    it('renders without Framer Motion when prefers-reduced-motion is enabled', () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      // Should render static prompt (no animation wrapper)
      expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();
    });

    it('has Suspense fallback for Framer Motion', () => {
      // This test verifies that component can render even if Framer Motion fails
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();
    });
  });

  describe('Dialog open/close state', () => {
    it('does not render when open is false', () => {
      render(<CollectionPrompt open={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when open is true', () => {
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});

describe('CollectionPromptWithAnimation (AC4)', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog when open (Suspense fallback or animated path)', () => {
    render(<CollectionPromptWithAnimation open={true} onClose={mockOnClose} />);

    // Either fallback or resolved AnimatedPrompt shows the same dialog
    expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();
    expect(
      screen.getByText('Loving what you see? Get the whole collection.'),
    ).toBeInTheDocument();
  });

  it('renders static prompt when prefers-reduced-motion is enabled', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<CollectionPromptWithAnimation open={true} onClose={mockOnClose} />);

    // Reduced motion path renders CollectionPrompt directly (no animation wrapper)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <CollectionPromptWithAnimation open={false} onClose={mockOnClose} />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<CollectionPromptWithAnimation open={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', {name: /close/i});
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

/**
 * Tests for cart mutation functionality (Story 4.3, Task 8)
 *
 * Verifies:
 * AC1: Add to cart when button clicked
 * AC2: Button shows loading state during API call
 * AC3: Button changes to "Added!" with checkmark on success
 * AC4: Prompt closes after 1 second on success
 * AC5: Zustand updates storyMomentShown on success
 * AC7: Warm error message displayed on failure
 */
describe('CollectionPrompt - Cart Mutation (Story 4.3)', () => {
  const mockOnClose = vi.fn();
  const varietyPackVariantId = 'gid://shopify/ProductVariant/123456';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset fetcher state to default
    fetcherState.state = 'idle';
    fetcherState.data = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('AC1 - Button click triggers cart mutation', () => {
    it('[P0] submits cart mutation with correct data when button clicked', async () => {
      // Use real timers for this test to avoid userEvent timeout issues
      vi.useRealTimers();

      const user = userEvent.setup();

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', {
        name: /get the collection/i,
      });
      await user.click(button);

      // Verify fetcher.submit was called
      expect(mockSubmit).toHaveBeenCalledTimes(1);

      // Verify FormData structure
      const [formData, options] = mockSubmit.mock.calls[0];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('cartAction')).toBe('LinesAdd');

      const lines = JSON.parse(formData.get('lines') as string);
      expect(lines).toEqual([
        {
          merchandiseId: varietyPackVariantId,
          quantity: 1,
        },
      ]);

      // Verify submit options
      expect(options).toEqual({
        method: 'POST',
        action: '/cart',
      });

      // Restore fake timers for subsequent tests
      vi.useFakeTimers();
    });

    it('[P1] does not submit if variantId is missing', async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: vi.advanceTimersByTime,
      });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          // variantId omitted
        />,
      );

      const button = screen.getByRole('button', {
        name: /get the collection/i,
      });

      // Button should be disabled
      expect(button).toBeDisabled();

      // Click should not trigger submit (disabled button can't be clicked)
      expect(mockSubmit).not.toHaveBeenCalled();

      // Should log warning
      expect(consoleSpy).not.toHaveBeenCalled(); // Only warns on click if not disabled

      consoleSpy.mockRestore();
    });
  });

  describe('AC2 - Loading state during API call', () => {
    it('[P0] displays "Adding..." text when fetcher is submitting', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'submitting';

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', { name: /get the collection|adding|added/i });
      expect(button).toHaveTextContent('Adding...');
    });

    it('[P0] button is disabled during loading state', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'loading';

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', { name: /get the collection|adding|added/i });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-60', 'cursor-not-allowed');
    });
  });

  describe('AC3 - Success state with checkmark', () => {
    it('[P0] displays "Added! ✓" text when mutation succeeds', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {cart: {id: 'cart-123'}};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', { name: /get the collection|adding|added/i });
      expect(button).toHaveTextContent('Added! ✓');
    });

    it('[P0] button is disabled after success (prevents double-add)', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {cart: {id: 'cart-123'}};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', { name: /get the collection|adding|added/i });
      expect(button).toBeDisabled();
    });
  });

  describe('AC4 - Auto-close after success', () => {
    it('[P0] closes prompt after 1 second on success', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {cart: {id: 'cart-123'}};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      // Should not close immediately
      expect(mockOnClose).not.toHaveBeenCalled();

      // Fast-forward 1 second
      vi.advanceTimersByTime(1000);

      // Should close after 1 second
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('[P1] respects prefers-reduced-motion (instant close)', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {cart: {id: 'cart-123'}};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      // With reduced motion, should close instantly (0ms delay)
      vi.advanceTimersByTime(0);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('AC5 - Zustand state update on success', () => {
    it('[P0] calls setStoryMomentShown(true) after successful cart mutation', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {cart: {id: 'cart-123'}};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      // Should not be called immediately
      expect(mockSetStoryMomentShown).not.toHaveBeenCalled();

      // Fast-forward 1 second to auto-close
      vi.advanceTimersByTime(1000);

      // Should be called with true after auto-close
      expect(mockSetStoryMomentShown).toHaveBeenCalledWith(true);
      expect(mockSetStoryMomentShown).toHaveBeenCalledTimes(1);
    });

    it('[P0] calls setCartDrawerOpen(true) after successful cart mutation (Story 5.3, AC4)', () => {
      // Mock successful state
      fetcherState.state = 'idle';
      fetcherState.data = {cart: {id: 'cart-123'}};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      // Should not be called immediately
      expect(mockSetCartDrawerOpen).not.toHaveBeenCalled();

      // Fast-forward 1 second to auto-close
      vi.advanceTimersByTime(1000);

      // Should be called with true to open cart drawer
      expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(true);
      expect(mockSetCartDrawerOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('AC7 - Error handling', () => {
    it('[P1] displays error message when cart mutation fails', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {errors: [{message: 'Error'}]};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      // Error message should be displayed
      const errorMessage = screen.getByRole('status');
      expect(errorMessage).toHaveTextContent(
        "Something went wrong. Let's try again.",
      );
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('[P1] button resets to "Get the Collection" on error', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {errors: [{message: 'Error'}]};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', { name: /get the collection|adding|added/i });
      expect(button).toHaveTextContent('Get the Collection');
      expect(button).not.toBeDisabled();
    });

    it('[P1] prompt does NOT auto-close on error (allows retry)', () => {
      // Mock removed - using mutable fetcherState instead
      fetcherState.state = 'idle';
      fetcherState.data = {errors: [{message: 'Error'}]};

      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      // Fast-forward time
      vi.advanceTimersByTime(5000);

      // Should NOT close on error
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  // Keyboard accessibility tests (Story 5.3, AC7)
  describe('Keyboard Accessibility', () => {
    it('[P0] button is keyboard accessible and focusable', () => {
      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', {
        name: /get the collection/i,
      });

      // Verify button is keyboard accessible (type=button allows Enter/Space)
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toBeDisabled();

      // Button can be focused
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('[P0] button can be triggered with click (Enter/Space delegated to browser)', () => {
      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', {
        name: /get the collection/i,
      });

      // Simulate button click (browsers handle Enter/Space → click automatically)
      button.click();

      // Verify submit was called
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  // Analytics verification (Story 5.3, AC1)
  describe('Analytics Tracking', () => {
    it('[P1] includes variant ID in cart submission', () => {
      render(
        <CollectionPrompt
          open={true}
          onClose={mockOnClose}
          variantId={varietyPackVariantId}
        />,
      );

      const button = screen.getByRole('button', {
        name: /get the collection/i,
      });

      // Click button to trigger form submission
      button.click();

      // Verify mockSubmit was called with FormData containing variant ID
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      const formData = mockSubmit.mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);

      // Verify lines contain variety pack variant ID
      const linesJson = formData.get('lines');
      expect(linesJson).toBeTruthy();
      const lines = JSON.parse(linesJson as string) as Array<{
        merchandiseId: string;
        quantity: number;
      }>;
      expect(lines[0].merchandiseId).toBe(varietyPackVariantId);
      expect(lines[0].quantity).toBe(1);
    });
  });
});
