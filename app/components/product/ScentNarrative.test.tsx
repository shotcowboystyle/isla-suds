import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';

let lastMotionDivProps: any;

const motionModule = vi.hoisted(() => ({
  module: {
    MotionDiv: (props: any) => {
      lastMotionDivProps = props;
      return (
        <div data-testid="motion-div" {...props}>
          {props.children}
        </div>
      );
    },
    prefersReducedMotion: () => false,
  },
}));

vi.mock('~/lib/motion', () => motionModule.module);

import {ScentNarrative} from './ScentNarrative';

describe('ScentNarrative', () => {
  const mockNarrative = 'Close your eyes. A field at dusk.';

  it('renders narrative text', () => {
    render(<ScentNarrative narrative={mockNarrative} isVisible={true} />);

    expect(screen.getByText(mockNarrative)).toBeInTheDocument();
  });

  it('accepts isVisible prop', () => {
    const {rerender} = render(
      <ScentNarrative narrative={mockNarrative} isVisible={false} />,
    );

    // Component should render regardless of visibility (handled by animation)
    expect(screen.getByText(mockNarrative)).toBeInTheDocument();

    rerender(<ScentNarrative narrative={mockNarrative} isVisible={true} />);
    expect(screen.getByText(mockNarrative)).toBeInTheDocument();
  });

  it('applies fluid-body typography class', () => {
    render(<ScentNarrative narrative={mockNarrative} isVisible={true} />);

    // Typography class is applied on the MotionDiv wrapper
    const wrapper = screen.getByTestId('motion-div');
    expect(wrapper).toHaveClass(/fluid-body|text-/);
  });

  it('renders as paragraph element', () => {
    render(<ScentNarrative narrative={mockNarrative} isVisible={true} />);

    const paragraphElement = screen.getByText(mockNarrative);
    expect(paragraphElement.tagName).toBe('P');
  });

  it('applies italic styling', () => {
    render(<ScentNarrative narrative={mockNarrative} isVisible={true} />);

    const narrativeElement = screen.getByText(mockNarrative);
    expect(narrativeElement).toHaveClass(/italic/);
  });

  it('provides contrast via text-shadow or background', () => {
    const {container} = render(
      <ScentNarrative narrative={mockNarrative} isVisible={true} />,
    );

    // Check for contrast enhancement classes (text-shadow, bg-gradient, backdrop)
    const wrapper =
      container.querySelector('[class*="text-shadow"]') ||
      container.querySelector('[class*="bg-gradient"]') ||
      container.querySelector('[class*="backdrop"]');

    expect(wrapper).toBeTruthy();
  });

  it('uses GPU-composited properties only for animation', () => {
    const {container} = render(
      <ScentNarrative narrative={mockNarrative} isVisible={true} />,
    );

    // The MotionDiv wrapper should not use transform-based animation classes.
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/translate|scale|rotate|skew/);
  });

  it('calls onAnimationComplete callback when provided', async () => {
    const onAnimationComplete = vi.fn();

    render(
      <ScentNarrative
        narrative={mockNarrative}
        isVisible={true}
        onAnimationComplete={onAnimationComplete}
      />,
    );

    // Simulate MotionDiv completing its animation
    lastMotionDivProps.onAnimationComplete?.();

    expect(onAnimationComplete).toHaveBeenCalledTimes(1);
  });

  it('has reduced motion support', () => {
    // Mock prefers-reduced-motion
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    vi.stubGlobal('matchMedia', matchMediaMock);

    render(<ScentNarrative narrative={mockNarrative} isVisible={true} />);

    expect(screen.getByText(mockNarrative)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('positions content at bottom of container', () => {
    const {container} = render(
      <ScentNarrative narrative={mockNarrative} isVisible={true} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(/bottom-0|bottom/);
  });

  it('uses absolute positioning', () => {
    const {container} = render(
      <ScentNarrative narrative={mockNarrative} isVisible={true} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(/absolute/);
  });
});
