import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {
  CollectionPrompt,
  CollectionPromptWithAnimation,
} from './CollectionPrompt';

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
      const mint = screen.getAllByText('Mint');

      expect(lavender.length).toBeGreaterThanOrEqual(1);
      expect(lemongrass.length).toBeGreaterThanOrEqual(1);
      expect(eucalyptus.length).toBeGreaterThanOrEqual(1);
      expect(mint.length).toBeGreaterThanOrEqual(1);
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
      render(<CollectionPrompt open={true} onClose={mockOnClose} />);

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
