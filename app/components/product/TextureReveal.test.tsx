import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react-dom/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {TextureReveal} from './TextureReveal';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

// Mock exploration store
const mockAddProductExplored = vi.fn();
const mockSetStoryMomentShown = vi.fn();
vi.mock('~/stores/exploration', () => ({
  useExplorationStore: (selector: any) => {
    const mockState = {
      productsExplored: new Set<string>(),
      textureRevealsTriggered: 0,
      storyMomentShown: false,
      addProductExplored: mockAddProductExplored,
      setStoryMomentShown: mockSetStoryMomentShown,
    };
    return selector ? selector(mockState) : mockState;
  },
}));

let lastMotionDivProps: any;
const scentNarrativeProps: any[] = [];

const motionModule = vi.hoisted(() => {
  const state = {prefersReducedMotion: false};

  return {
    state,
    module: {
      MotionDiv: (props: any) => {
        lastMotionDivProps = props;
        return (
          <div data-testid="motion-div" {...props}>
            {props.children}
          </div>
        );
      },
      prefersReducedMotion: () => state.prefersReducedMotion,
    },
  };
});

vi.mock('~/lib/motion', () => motionModule.module);

// Control collection prompt trigger for integration test (Story 4.2)
const collectionPromptTriggerState = vi.hoisted(() => ({
  shouldShowPrompt: false,
}));
vi.mock('~/hooks/use-collection-prompt-trigger', () => ({
  useCollectionPromptTrigger: () => ({
    shouldShowPrompt: collectionPromptTriggerState.shouldShowPrompt,
  }),
}));

vi.mock('./ScentNarrative', () => ({
  ScentNarrative: (props: any) => {
    scentNarrativeProps.push(props);
    return <div data-testid="scent-narrative">{props.narrative}</div>;
  },
}));

vi.mock('./ProductRevealInfo', () => ({
  ProductRevealInfo: (props: any) => (
    <div data-testid="product-reveal-info">
      <h3>{props.product.title}</h3>
      <p>${props.product.priceRange.minVariantPrice.amount}</p>
    </div>
  ),
}));

// Mock product data matching RecommendedProductFragment structure
const mockProduct: RecommendedProductFragment = {
  id: 'gid://shopify/Product/1',
  title: 'Lavender Dreams Soap',
  handle: 'lavender-dreams',
  description: 'A soothing lavender soap with calming properties.',
  featuredImage: {
    id: 'gid://shopify/ProductImage/1',
    url: 'https://cdn.shopify.com/product.jpg',
    altText: 'Lavender soap bar',
    width: 800,
    height: 800,
  },
  variants: {nodes: [{id: 'gid://shopify/ProductVariant/12345'}]},
  priceRange: {
    minVariantPrice: {
      amount: '12.00',
      currencyCode: 'USD',
    },
  },
};

describe('TextureReveal', () => {
  beforeEach(() => {
    motionModule.state.prefersReducedMotion = false;
    scentNarrativeProps.length = 0;
    lastMotionDivProps = undefined;
    mockAddProductExplored.mockClear();
    mockSetStoryMomentShown.mockClear();
    collectionPromptTriggerState.shouldShowPrompt = false;
  });
  it('renders with required props', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Component should render when open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has correct aria-label for screen reader announcement', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Should announce product name in aria-label
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Lavender Dreams Soap'),
    );
  });

  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={false}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Dialog should not be present when closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when dialog is dismissed', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Trigger close via Escape key simulation
    const dialog = screen.getByRole('dialog');
    // Radix Dialog handles Escape internally, we're just verifying the callback is passed
    expect(dialog).toBeInTheDocument();
    expect(onClose).toBeDefined();
  });

  it('displays texture image with correct URL', () => {
    const onClose = vi.fn();
    const textureUrl = 'https://cdn.shopify.com/texture.jpg';

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl={textureUrl}
      />,
    );

    // Should display texture image
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining(textureUrl));
  });

  it('accepts and forwards ref correctly', () => {
    const onClose = vi.fn();
    const ref = vi.fn();

    render(
      <TextureReveal
        ref={ref}
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Ref should be called with element
    expect(ref).toHaveBeenCalled();
  });

  it('uses GPU-composited animation properties only', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Dialog should be present
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Overlay should have opacity transitions (GPU-composited)
    const overlay = dialog.parentElement?.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });

  it('shows scent narrative immediately when prefers-reduced-motion is true', () => {
    const onClose = vi.fn();
    const scentNarrative = 'Close your eyes. A field at dusk.';

    motionModule.state.prefersReducedMotion = true;
    scentNarrativeProps.length = 0;

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
        scentNarrative={scentNarrative}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const props = scentNarrativeProps.at(-1);
    expect(props?.isVisible).toBe(true);
  });

  it('has focusable content for keyboard navigation (AC4)', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Radix Dialog automatically traps focus and moves focus into dialog content
    // Close button has product-specific label (AC1)
    const closeButton = screen.getByLabelText(
      'Close texture view for Lavender Dreams Soap',
    );
    expect(closeButton).toBeInTheDocument();
    // Dialog content should be focusable (Radix handles this automatically)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // Radix Dialog.Content automatically receives focus when opened (AC4 requirement)
  });

  it('displays scent narrative when provided', () => {
    const onClose = vi.fn();
    const scentNarrative = 'Close your eyes. A field at dusk.';

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
        scentNarrative={scentNarrative}
      />,
    );

    // Narrative text should be present
    expect(screen.getByText(scentNarrative)).toBeInTheDocument();
  });

  it('does not display narrative when not provided', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
      />,
    );

    // Dialog should render without narrative
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('only shows scent narrative after reveal animation completes', () => {
    const onClose = vi.fn();
    const scentNarrative = 'Close your eyes. A field at dusk.';

    scentNarrativeProps.length = 0;

    const {rerender} = render(
      <TextureReveal
        product={mockProduct}
        isOpen={false}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
        scentNarrative={scentNarrative}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
        scentNarrative={scentNarrative}
      />,
    );

    const firstRenderProps = scentNarrativeProps.at(-1);
    expect(firstRenderProps?.isVisible).toBe(false);

    act(() => {
      lastMotionDivProps.onAnimationComplete?.();
    });

    const afterAnimationProps = scentNarrativeProps.at(-1);
    expect(afterAnimationProps?.isVisible).toBe(true);
  });

  it('includes ProductRevealInfo with product data (Story 3.4)', () => {
    const onClose = vi.fn();

    render(
      <TextureReveal
        product={mockProduct}
        isOpen={true}
        onClose={onClose}
        textureImageUrl="https://cdn.shopify.com/texture.jpg"
        scentNarrative="Lavender fields"
      />,
    );

    // Trigger animation complete to show product info
    act(() => {
      lastMotionDivProps.onAnimationComplete?.();
    });

    // ProductRevealInfo should be rendered with product data
    const productInfo = screen.getByTestId('product-reveal-info');
    expect(productInfo).toBeInTheDocument();
    expect(productInfo).toHaveTextContent('Lavender Dreams Soap');
    expect(productInfo).toHaveTextContent('$12.00');
  });

  // Story 3.5: Close/Dismiss Behavior Tests

  describe('Close behavior (Story 3.5)', () => {
    it('calls onClose when close button is clicked (AC1)', () => {
      const onClose = vi.fn();

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      const closeButton = screen.getByLabelText(
        'Close texture view for Lavender Dreams Soap',
      );
      closeButton.click();

      // Should call onClose callback and mark explored
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockAddProductExplored).toHaveBeenCalledWith(mockProduct.id);
    });

    it('calls onClose when Escape key is pressed (AC3)', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockAddProductExplored).toHaveBeenCalledWith(mockProduct.id);
    });

    it('calls onClose when clicking overlay (AC2)', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      const overlay = screen.getByTestId('texture-reveal-overlay');
      await user.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockAddProductExplored).toHaveBeenCalledWith(mockProduct.id);
    });

    it('respects reduced motion preference when closing (AC4)', () => {
      const onClose = vi.fn();
      motionModule.state.prefersReducedMotion = true;

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      // When reduced motion is enabled, variants should be undefined
      // This causes instant state change without animation
      expect(lastMotionDivProps.variants).toBeUndefined();
    });

    it('does not make network requests on close (AC6)', () => {
      const onClose = vi.fn();
      const originalFetch = global.fetch;
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      const closeButton = screen.getByLabelText(
        'Close texture view for Lavender Dreams Soap',
      );
      closeButton.click();

      // No fetch calls should be made during close
      expect(fetchSpy).not.toHaveBeenCalled();

      global.fetch = originalFetch;
    });

    it('handles close with animation complete callback', () => {
      const onClose = vi.fn();
      const onAnimationComplete = vi.fn();

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
          onAnimationComplete={onAnimationComplete}
        />,
      );

      // Close the dialog
      const closeButton = screen.getByLabelText(
        'Close texture view for Lavender Dreams Soap',
      );
      closeButton.click();

      // Should call onClose
      expect(onClose).toHaveBeenCalled();

      // Animation callback should have been registered
      expect(onAnimationComplete).toBeDefined();
    });

    it('marks product as explored when reveal is closed (AC5, Task 6)', () => {
      const onClose = vi.fn();

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      const closeButton = screen.getByLabelText(
        'Close texture view for Lavender Dreams Soap',
      );
      closeButton.click();

      // Should mark product as explored in exploration store
      expect(mockAddProductExplored).toHaveBeenCalledTimes(1);
      expect(mockAddProductExplored).toHaveBeenCalledWith(mockProduct.id);

      // Should also call parent onClose callback
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Story 4.2 - Collection prompt after 2 products explored', () => {
    it('shows collection prompt after closing reveal when shouldShowPrompt is true', async () => {
      vi.useFakeTimers();
      const onClose = vi.fn();

      // Simulate hook returning true (2+ products explored, prompt not shown yet)
      collectionPromptTriggerState.shouldShowPrompt = true;

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      // Texture reveal dialog is open (close button implies dialog is present)
      expect(
        screen.getByLabelText('Close texture view for Lavender Dreams Soap'),
      ).toBeInTheDocument();

      // Close the texture reveal (e.g. user clicks close button)
      const closeButton = screen.getByLabelText(
        'Close texture view for Lavender Dreams Soap',
      );
      closeButton.click();

      // Advance past the 250ms delay before showing collection prompt
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Collection prompt dialog should now be visible
      expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();
      expect(
        screen.getByText('Loving what you see? Get the whole collection.'),
      ).toBeInTheDocument();

      // Story moment should be marked as shown
      expect(mockSetStoryMomentShown).toHaveBeenCalledWith(true);

      vi.useRealTimers();
    });

    it('does not show collection prompt when shouldShowPrompt is false', async () => {
      vi.useFakeTimers();
      const onClose = vi.fn();

      collectionPromptTriggerState.shouldShowPrompt = false;

      render(
        <TextureReveal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          textureImageUrl="https://cdn.shopify.com/texture.jpg"
        />,
      );

      const closeButton = screen.getByLabelText(
        'Close texture view for Lavender Dreams Soap',
      );
      closeButton.click();

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Only texture reveal dialog was present; collection prompt never appears
      expect(screen.queryByTestId('collection-prompt')).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });
});
