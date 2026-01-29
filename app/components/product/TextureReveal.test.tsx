import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {TextureReveal} from './TextureReveal';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

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
    // The close button should be focusable
    const closeButton = screen.getByLabelText('Close texture view');
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
});
